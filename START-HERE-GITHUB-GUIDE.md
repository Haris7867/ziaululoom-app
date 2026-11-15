# START HERE — what changed + how to upload (GitHub) + how to deploy

## 1. What changed in this version (v13)
- Header: full green (same as footer), name in a white bold box, no search bar, no login button.
  Menu is now 6 items: Home, About, Academics (dropdown: Programmes, Admissions, Student Life, Student Portal),
  Resources (dropdown: Library, Darul Ifta, Ask a Question), Events (dropdown: Events, Gallery, Qurbani), Contact.
- All hero text is white on every page (including Qurbani, Ask a Question, event pages and the home slider).
- Home slider is shorter, so the cards below are visible without scrolling.
- Quick-link cards: fee card and Admissions card removed. Each card has a photo and the whole card is a link.
- Rector section: new name "Sheikh ul Hadith Allama Peer Syed Zia Ul Haq Shah Sahib", your photo, professional frame.
  The same photo is used on the About page.
- Programmes: BS Fiqh & Islamic Law removed. Alimiyyah = 8 years (8 year tabs on its page). "Sponsored" and tuition text removed
  from every card, the programme pages and the PDF prospectus. Every card now has a photo.
- Fees: only "PKR 500 per month" is shown, on the Admissions page.
- Why-choose-us cards, PDF cards (Khutbat/Durus/Fiqh) and Fatwa cards now have realistic photos.
- Testimonials: light-green card with green accents.
- Your photos replaced the old sample photos everywhere (hero slider, page banners, cards).

## 2. Where your photos are
All photos are in `public/images/`:
- rector-portrait.jpg (cropped for the home page), rector-podium.jpg, rector-door.jpg, rector-shrine.jpg
- campus-angle.jpg, courtyard.jpg, courtyard-cars.jpg, dome.jpg, dome-city.jpg
- students-building.jpg, students-hall.jpg, students-hall-aerial.jpg
- books-a.jpg, books-b.jpg, books-c.jpg, scholar-reading.jpg
To change which photo a card uses, edit `src/lib/site.ts` (QUICK_TILES, WHY_US, PROGRAMME_IMAGES, PDF_IMAGES, HERO_SLIDES).
To add new photos later (gallery), put the files in `public/images/` — keep names lowercase, no spaces.

## 3. Uploading to GitHub (first time, step by step — no coding tools needed)
1. Unzip `jamia-ghousia-v13-FULL.zip` on your computer. You get a folder with: `src`, `public`, and files like `package.json`.
2. Open your repository on github.com and sign in.
3. Click **Add file → Upload files**.
4. Drag in the contents of the unzipped folder: the **src** folder, the **public** folder, and ALL the files in the top level
   (package.json, package-lock.json, next.config.ts, tsconfig.json, etc.). Do NOT upload a folder called node_modules or .next.
   Tip: open the unzipped folder, press Ctrl+A to select everything, and drag it all into the GitHub page.
5. Wait until every file shows as uploaded. (If GitHub says too many files, upload `src` first, commit, then `public`, commit, then the rest.)
6. At the bottom, write a message like "v13 header, photos, programmes" and click **Commit changes** (keep "Commit directly to the main branch").
7. Same names = GitHub replaces the old files. Files you deleted in this version (for example none required) can stay — they are harmless.

## 4. Deploying (making the new version live)
Your host builds the site from GitHub, so after step 3 it normally redeploys by itself in 1–3 minutes.
- Open your hosting dashboard (for example Vercel → your project → **Deployments**). A new deployment starts after your commit.
- When it says **Ready**, open your website in a private/incognito window and press Ctrl+F5 to see the new version.
- If it says **Error**: click the deployment, open the build log, and send me a screenshot of the last red lines.

First time ever on Vercel (only if you are creating a new site):
1. vercel.com → Add New → Project → Import your GitHub repository.
2. Framework: Next.js (auto-detected). Build command: leave default.
3. Environment Variables: add `DATABASE_URL` (your PostgreSQL connection string) — the site needs it. Keep the same one you already use.
4. Click Deploy.

## 5. If something looks wrong after deploying
- Old design still showing → hard refresh (Ctrl+F5) or open in a private window.
- Photos missing → check that the `public/images` folder uploaded with all the .jpg files.
- Send me screenshots and I will fix everything in one zip again.
