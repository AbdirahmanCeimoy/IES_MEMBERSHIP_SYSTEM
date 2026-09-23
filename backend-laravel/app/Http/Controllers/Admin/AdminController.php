<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MembershipApplication;
use App\Models\OrganizationApplication;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * AdminController — dashboard overview stats, aggregated queries and
 * report exports. All routes here MUST be behind the role:ADMIN middleware.
 */
class AdminController extends Controller
{
    /**
     * GET /admin/stats
     * Institution-wide counters used by the /admin overview page.
     */
    public function stats(): JsonResponse
    {
        $now = Carbon::now();
        $monthStart = $now->copy()->startOfMonth();

        $applications = MembershipApplication::query();

        $stats = [
            'totalMembers' => (int) User::query()->where('role', 'MEMBER')->count(),
            'totalAdmins' => (int) User::query()->where('role', 'ADMIN')->count(),
            'pendingApplications' => (int) (clone $applications)->where('status', 'PENDING')->count(),
            'inReviewApplications' => (int) (clone $applications)->where('status', 'REVIEW')->count(),
            'approvedApplications' => (int) (clone $applications)->where('status', 'APPROVED')->count(),
            'rejectedApplications' => (int) (clone $applications)->where('status', 'REJECTED')->count(),
            'approvedThisMonth' => (int) (clone $applications)
                ->where('status', 'APPROVED')
                ->where('updatedAt', '>=', $monthStart)
                ->count(),
            'organizations' => (int) OrganizationApplication::query()
                ->where('status', 'APPROVED')
                ->count(),
            'pendingOrganizations' => (int) OrganizationApplication::query()
                ->where('status', 'PENDING')
                ->count(),
        ];

        // Monthly applications for the last 6 months (Jan..Jun current year).
        $monthly = [];
        for ($i = 5; $i >= 0; $i--) {
            $m = $now->copy()->subMonths($i);
            $start = $m->copy()->startOfMonth();
            $end = $m->copy()->endOfMonth();
            $monthly[] = [
                'month' => $m->format('M'),
                'year' => (int) $m->format('Y'),
                'applications' => (int) MembershipApplication::query()
                    ->whereBetween('createdAt', [$start, $end])
                    ->count(),
                'approvals' => (int) MembershipApplication::query()
                    ->where('status', 'APPROVED')
                    ->whereBetween('updatedAt', [$start, $end])
                    ->count(),
            ];
        }

        // Recent activity feed (latest 10 applications).
        $recent = MembershipApplication::query()
            ->orderByDesc('createdAt')
            ->limit(10)
            ->get(['id', 'fullName', 'email', 'membershipGrade', 'status', 'createdAt'])
            ->map(fn ($row) => [
                'id' => $row->id,
                'applicant' => $row->fullName,
                'grade' => $row->membershipGrade,
                'status' => $row->status,
                'when' => optional($row->createdAt)->toIso8601String(),
            ])
            ->all();

        return response()->json([
            'stats' => $stats,
            'monthly' => $monthly,
            'recent' => $recent,
        ]);
    }

    /**
     * GET /admin/analytics
     * Extended analytics used by the Reports page — gender breakdown,
     * per-grade counts, and rolling time-period totals (last month, last
     * 6 months, last year, all-time).
     */
    public function analytics(): JsonResponse
    {
        $now = Carbon::now();
        $lastMonthStart = $now->copy()->subMonth();
        $last6MonthsStart = $now->copy()->subMonths(6);
        $lastYearStart = $now->copy()->subYear();

        $base = MembershipApplication::query();

        // Gender breakdown from the User table (Male/Female/Other/Unspecified).
        $gender = ['MALE' => 0, 'FEMALE' => 0, 'OTHER' => 0, 'UNSPECIFIED' => 0];
        try {
            $rows = User::query()
                ->selectRaw('UPPER(COALESCE(gender, "UNSPECIFIED")) as g, COUNT(*) as c')
                ->groupBy('g')
                ->get();
            foreach ($rows as $row) {
                $key = in_array($row->g, ['MALE', 'FEMALE', 'OTHER'], true) ? $row->g : 'UNSPECIFIED';
                $gender[$key] = (int) ($gender[$key] ?? 0) + (int) $row->c;
            }
        } catch (\Throwable $e) {
            // Column doesn't exist — leave defaults at 0.
        }

        // Per-grade counts.
        $grades = [];
        try {
            $rows = (clone $base)
                ->selectRaw('membershipGrade as grade, COUNT(*) as c')
                ->groupBy('grade')
                ->get();
            foreach ($rows as $row) {
                $grades[$row->grade ?? 'UNKNOWN'] = (int) $row->c;
            }
        } catch (\Throwable $e) {
            // ignore
        }

        // Time-period totals.
        $periods = [
            'lastMonth' => (int) (clone $base)->where('createdAt', '>=', $lastMonthStart)->count(),
            'last6Months' => (int) (clone $base)->where('createdAt', '>=', $last6MonthsStart)->count(),
            'lastYear' => (int) (clone $base)->where('createdAt', '>=', $lastYearStart)->count(),
            'allTime' => (int) (clone $base)->count(),
        ];

        // Time-period approvals.
        $approvals = [
            'lastMonth' => (int) (clone $base)->where('status', 'APPROVED')->where('updatedAt', '>=', $lastMonthStart)->count(),
            'last6Months' => (int) (clone $base)->where('status', 'APPROVED')->where('updatedAt', '>=', $last6MonthsStart)->count(),
            'lastYear' => (int) (clone $base)->where('status', 'APPROVED')->where('updatedAt', '>=', $lastYearStart)->count(),
            'allTime' => (int) (clone $base)->where('status', 'APPROVED')->count(),
        ];

        return response()->json([
            'gender' => $gender,
            'grades' => $grades,
            'periods' => $periods,
            'approvals' => $approvals,
        ]);
    }

    /**
     * GET /admin/reports/{key}
     * Streams a CSV export for the given report key.
     * Supported keys: members, applications, cpd, events, financials, discipline.
     */
    public function report(Request $request, string $key): StreamedResponse
    {
        $filename = sprintf('ies-%s-%s.csv', $key, Carbon::now()->format('Y-m-d'));

        return response()->streamDownload(function () use ($key) {
            $out = fopen('php://output', 'w');
            switch ($key) {
                case 'members':
                    fputcsv($out, ['Registration No', 'Full Name', 'Email', 'Grade', 'Joined']);
                    User::query()
                        ->where('role', 'MEMBER')
                        ->orderByDesc('createdAt')
                        ->chunk(500, function ($users) use ($out) {
                            foreach ($users as $u) {
                                fputcsv($out, [
                                    $u->id,
                                    $u->fullName,
                                    $u->email,
                                    $u->grade ?? '-',
                                    optional($u->createdAt)->format('Y-m-d'),
                                ]);
                            }
                        });
                    break;

                case 'applications':
                    fputcsv($out, ['ID', 'Applicant', 'Email', 'Grade', 'Status', 'Submitted']);
                    MembershipApplication::query()
                        ->orderByDesc('createdAt')
                        ->chunk(500, function ($apps) use ($out) {
                            foreach ($apps as $a) {
                                fputcsv($out, [
                                    $a->id,
                                    $a->fullName,
                                    $a->email,
                                    $a->membershipGrade,
                                    $a->status,
                                    optional($a->createdAt)->format('Y-m-d H:i'),
                                ]);
                            }
                        });
                    break;

                case 'discipline':
                    fputcsv($out, ['Discipline', 'Members']);
                    MembershipApplication::query()
                        ->where('status', 'APPROVED')
                        ->selectRaw('discipline, COUNT(*) as members')
                        ->groupBy('discipline')
                        ->orderByDesc('members')
                        ->get()
                        ->each(fn ($row) => fputcsv($out, [$row->discipline ?? 'Unknown', $row->members]));
                    break;

                default:
                    // For keys with no data source yet, write a placeholder row.
                    fputcsv($out, ['Report', 'Status']);
                    fputcsv($out, [$key, 'Not yet implemented — placeholder export.']);
                    break;
            }
            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * GET /admin/applications
     * Convenience wrapper that returns applications with optional status
     * filter, so the admin UI can hit a single endpoint.
     */
    public function applications(Request $request): JsonResponse
    {
        $q = MembershipApplication::query();
        if ($status = $request->query('status')) {
            $q->where('status', strtoupper($status));
        }
        if ($search = $request->query('search')) {
            $needle = "%{$search}%";
            $q->where(function ($qq) use ($needle) {
                $qq->where('fullName', 'like', $needle)
                    ->orWhere('email', 'like', $needle)
                    ->orWhere('membershipGrade', 'like', $needle);
            });
        }

        $rows = $q->orderByDesc('createdAt')
            ->limit(200)
            ->get(['id', 'fullName', 'email', 'membershipGrade', 'status', 'createdAt', 'updatedAt'])
            ->map(fn ($a) => [
                'id' => $a->id,
                'applicant' => $a->fullName,
                'email' => $a->email,
                'grade' => $a->membershipGrade,
                'status' => strtolower($a->status),
                'submitted' => optional($a->createdAt)->format('Y-m-d'),
            ])
            ->all();

        return response()->json(['applications' => $rows]);
    }
}
