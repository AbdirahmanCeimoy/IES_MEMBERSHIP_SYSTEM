<?php

namespace App\Services\Assistant;

/**
 * Pattern-matched answers that use the hardcoded config('ies_knowledge') content.
 *
 * Used instead of OpenAI when OPENAI_API_KEY is empty, so the widget still gives
 * useful IES-grounded answers without the real AI being configured.
 * Never fabricates facts — answers only come from the knowledge base.
 */
class MockAssistantService
{
    /**
     * @return array{reply: string, sources: list<array{title: string, href: string}>, model: string}
     */
    public function respond(string $userMessage, array $history = []): array
    {
        $q = strtolower(trim($userMessage));
        $k = (array) config('ies_knowledge', []);
        $about = (array) ($k['about'] ?? []);
        $membership = (array) ($k['membership'] ?? []);
        $services = (array) ($k['services'] ?? []);

        $isSomali = $this->looksLikeSomali($q);

        // --- Intent matching, most specific first -------------------------
        if ($this->match($q, ['apply', 'join', 'become a member', 'sign up', 'application', 'ku biir'])) {
            $reply = $isSomali
                ? "Si aad xubin IES u noqoto, booqo page-ka Membership → Apply for Membership ee website-ka IES. Akhri Online Application Guidelines-ka, ka buuxi foomka, soo gudbi dukumintiyada loo baahan yahay, oo bixi kharash shaqo. Kooxda Membership-ku waxay dib u eegi doontaa codsiga oo waxay kula xidhiidhi doontaa dhammaadka."
                : ($membership['how_to_apply'] ?? 'Please visit the Membership → Apply page on the IES website for the full application process.');
            return $this->ok($reply, [
                ['title' => 'Apply for Membership', 'href' => '/membership/online-application-guidelines'],
                ['title' => 'Membership Categories', 'href' => '/membership/membership-categories'],
            ]);
        }

        if ($this->match($q, ['grade', 'categor', 'level', 'types of member', 'fellow', 'student member', 'graduate member', 'associate', 'corporate'])) {
            $gradeLines = [];
            foreach (($membership['grades'] ?? []) as $g) {
                $gradeLines[] = "- {$g['name']} ({$g['code']}): {$g['description']}";
            }
            $reply = ($isSomali ? "IES waxay leedahay 5 heer xubinnimo:\n\n" : "IES offers 5 membership grades:\n\n") . implode("\n", $gradeLines);
            return $this->ok($reply, [
                ['title' => 'Membership Categories', 'href' => '/membership/membership-categories'],
            ]);
        }

        if ($this->match($q, ['member', 'membership', 'xubin', 'xubinnimo'])) {
            $reply = ($membership['intro'] ?? '') . "\n\n" .
                ($isSomali
                    ? 'Si aad u aragto heer walba oo faahfaahsan, booqo page-ka Membership Categories.'
                    : 'Visit the Membership Categories page to see each grade in detail.');
            return $this->ok($reply, [
                ['title' => 'Membership Categories', 'href' => '/membership/membership-categories'],
                ['title' => 'Apply for Membership', 'href' => '/membership/online-application-guidelines'],
            ]);
        }

        if ($this->match($q, ['service', 'what does ies do', 'activities', 'what do you offer', 'what do you do'])) {
            $reply = ($isSomali
                ? "Qaar ka mid ah waxyaabaha IES samayso:\n\n"
                : "Here is what IES does:\n\n")
                . implode("\n", array_map(fn ($s) => '- ' . $s, $services));
            return $this->ok($reply, [
                ['title' => 'About IES', 'href' => '/about'],
                ['title' => 'Events', 'href' => '/events'],
            ]);
        }

        if ($this->match($q, ['event', 'seminar', 'webinar', 'conference', 'wed', 'inwed', 'barnaamij', 'shir'])) {
            $reply = $isSomali
                ? "IES waxay qaban qaabisaa seminars, webinars virtual ah, iyo barnaamijyada sanadlaha ah sida World Engineering Day (WED) iyo International Women in Engineering Day (INWED). Booqo page-ka Events si aad u aragto barnaamijyada hadda socda iyo kuwii hore."
                : "IES organizes seminars, virtual webinars, and annual programmes like World Engineering Day (WED) and International Women in Engineering Day (INWED). Visit the Events page for upcoming and past programmes.";
            return $this->ok($reply, [
                ['title' => 'Events', 'href' => '/events'],
                ['title' => 'Seminars', 'href' => '/events/programmes/seminars'],
            ]);
        }

        if ($this->match($q, ['document', 'resource', 'strategic plan', 'governance', 'constitution'])) {
            $reply = $isSomali
                ? "Dukumintiyada rasmiga ah ee IES waxaa laga helayaa page-ka Governance Resources, oo ay ku jiraan Strategic Plan 2026-2030."
                : "IES official documents are published on the Governance Resources page, including the Strategic Plan 2026-2030.";
            return $this->ok($reply, [
                ['title' => 'Governance Resources', 'href' => '/about/governance-resources'],
                ['title' => 'Strategic Plan 2026-2030', 'href' => '/about/governance-resources/strategic-plan-2026-2030'],
            ]);
        }

        if ($this->match($q, ['news', 'announce', 'latest', 'warar', 'ogeysiis'])) {
            $reply = $isSomali
                ? "Warar iyo ogeysiisyada ugu dambeeyay ee IES waxaa laga helayaa page-ka Info Hub → News / Announcements."
                : "The latest IES news and announcements are published under Info Hub → News and Announcements.";
            return $this->ok($reply, [
                ['title' => 'News', 'href' => '/info-hub/news'],
                ['title' => 'Announcements', 'href' => '/info-hub/announcements'],
            ]);
        }

        if ($this->match($q, ['contact', 'email', 'phone', 'reach', 'address', 'xidhiidh', 'telefoon'])) {
            $email = $about['contact']['general_email'] ?? 'info@iesomalia.org.so';
            $site = $about['contact']['website'] ?? 'https://iesomalia.org.so';
            $reply = $isSomali
                ? "Si aad IES ula xidhiidho:\n\nEmail: {$email}\nWebsite: {$site}\n\nAma booqo page-ka Contact Us."
                : "You can reach IES at:\n\nEmail: {$email}\nWebsite: {$site}\n\nOr visit the Contact Us page.";
            return $this->ok($reply, [
                ['title' => 'Contact Us', 'href' => '/contact'],
            ]);
        }

        if ($this->match($q, ['report', 'violation', 'complaint', 'ethics', 'misconduct'])) {
            $reply = $isSomali
                ? "Haddii aad doonayso in aad ka warbixiso ku xadgudub xirfadeed ama cabasho, booqo page-ka Report Violations. Guddiga Anshaxa ee IES ayaa dib u eegi doona arrinta si gaar ah."
                : "To report a professional violation or submit a complaint, visit the Report Violations page. The IES Ethics Committee reviews each submission confidentially.";
            return $this->ok($reply, [
                ['title' => 'Report Violations', 'href' => '/report-violations'],
            ]);
        }

        if ($this->match($q, ['council', 'president', 'vice president', 'secretary', 'leader', 'board'])) {
            $reply = $isSomali
                ? "Hoggaanka iyo guddida IES waa lagu kala saaray page-ka IES Council. Booqo si aad u aragto hoggaamiyeyaasha hadda jira."
                : "The IES Council and leadership are listed on the IES Council page. Visit it to see the current officers.";
            return $this->ok($reply, [
                ['title' => 'IES Council', 'href' => '/about/ies-council' ],
                ['title' => 'IES Committees', 'href' => '/about/ies-committees' ],
            ]);
        }

        if ($this->match($q, ['committee', 'wec', 'women', 'women engineer'])) {
            $reply = $isSomali
                ? "IES waxay leedahay guddiyo kala duwan oo xirfadeed, oo ay ku jirto Women Engineers Committee (WEC) oo gaar u ah ku dhiirrigelinta xirfadeeda hablaha iyo haweenka injineerada ah. Booqo page-ka IES Committees."
                : "IES has several professional committees, including the Women Engineers Committee (WEC) focused on supporting women in engineering. Visit the IES Committees page.";
            return $this->ok($reply, [
                ['title' => 'IES Committees', 'href' => '/about/ies-committees'],
            ]);
        }

        if ($this->match($q, ['what is ies', 'about ies', 'who is ies', 'what does ies stand', 'tell me about ies', 'tell me about the institution', 'maxay tahay ies', 'waa maxay ies'])) {
            $reply = $isSomali
                ? ($about['short_description'] ?? 'Institution of Engineers Somalia (IES) waa ururka xirfadlayaasha injineeriyada ee qaranka Soomaaliya.')
                : ($about['short_description'] ?? 'The Institution of Engineers Somalia (IES) is the national professional engineering organization of Somalia.');
            return $this->ok($reply . "\n\n" . ($about['mission'] ? ($isSomali ? 'Hadaf: ' : 'Mission: ') . $about['mission'] : ''), [
                ['title' => 'About IES', 'href' => '/about'],
            ]);
        }

        if ($this->match($q, ['hello', 'hi ', 'hey', 'salaam', 'asc', 'salam', 'assalamu alaikum'])) {
            $reply = $isSomali
                ? "Asalaam calaykum! Waxaan ahay IES AI Assistant. Sideen kuu caawin karaa maanta? Waxaad weydiin kartaa wax ku saabsan xubinnimada, barnaamijyada, iyo adeegyada IES."
                : "Hello! I'm the IES AI Assistant. How may I help you today? You can ask about IES membership, events, services, and resources.";
            return $this->ok($reply, []);
        }

        if ($this->match($q, ['fee', 'cost', 'price', 'how much', 'qiimo', 'lacag'])) {
            $reply = $isSomali
                ? "Qiimaha xubinnimada iyo mushaharka xidid-xidka ma haysto xogtayda ammaanta ah. Fadlan la xidhiidh IES Secretariat info@iesomalia.org.so ama booqo page-ka Membership si aad u hesho faahfaahinta ugu dambeysa."
                : "I don't have exact membership fee information in my verified knowledge. Please contact the IES Secretariat at info@iesomalia.org.so or visit the Membership page for the latest details.";
            return $this->ok($reply, [
                ['title' => 'Contact Us', 'href' => '/contact'],
                ['title' => 'Membership Categories', 'href' => '/membership/membership-categories'],
            ]);
        }

        // Fallback - don't guess
        $reply = $isSomali
            ? "Ma hubin karo arrintan si sax ah. Fadlan la xidhiidh IES Secretariat info@iesomalia.org.so ama booqo iesomalia.org.so si aad u hesho jawaab rasmi ah. Waxaad kaloo weydiin kartaa wax ku saabsan xubinnimada, barnaamijyada, ama adeegyada IES."
            : "I'm not sure about that specific question. Please contact the IES Secretariat at info@iesomalia.org.so or visit iesomalia.org.so for an authoritative answer. You can also ask me about IES membership, events, or services.";
        return $this->ok($reply, [
            ['title' => 'Contact Us', 'href' => '/contact'],
        ]);
    }

    /** @return array{reply: string, sources: list<array{title: string, href: string}>, model: string} */
    private function ok(string $reply, array $sources): array
    {
        return [
            'reply' => $reply,
            'sources' => $sources,
            'model' => 'ies-knowledge-base',
        ];
    }

    private function match(string $q, array $needles): bool
    {
        foreach ($needles as $n) {
            if (str_contains($q, $n)) return true;
        }
        return false;
    }

    private function looksLikeSomali(string $q): bool
    {
        $somaliMarkers = ['sidee', 'maxaa', 'maxay', 'waxaan', 'waa', 'ku saabsan', 'xubin', 'barnaamij', 'adeeg', 'warar', 'ies ma', 'ies waa', 'waa maxay', 'salaam', 'asc', 'assalamu'];
        foreach ($somaliMarkers as $m) {
            if (str_contains($q, $m)) return true;
        }
        return false;
    }
}
