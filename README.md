# Tirumala Sumith — Portfolio

A responsive static portfolio with an orange and charcoal visual theme, dark/light mode, and subtle scroll reveals. The portfolio content is stored in `content.json`. The photo can be replaced from the built-in editor.

## Preview and edit

1. Open a terminal in this folder.
2. Run `python3 -m http.server 8000`.
3. Open <http://localhost:8000/editor.html>.
4. Edit your text, projects, skills, dates, links, seal, accent color, and photo. The preview updates as you type and your draft is saved in that browser.
5. Select **Download site content**. Replace this folder's `content.json` with the downloaded file. Your chosen photo is included in that file.

The editor also lets you adjust the portrait crop and switch its black and white treatment on or off.

## Publish with GitHub Pages

1. Create a **public** GitHub repository named `sumith-portfolio`.
2. Upload the contents of this folder to the repository root. Keep `index.html`, `editor.html`, `portfolio.js`, `editor.js`, `content.json`, `styles.css`, `editor.css`, `script.js`, and `assets/` together.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose branch `main` and folder `/(root)`, then select **Save**.
6. Wait for the Pages deployment to finish. With your GitHub username, your project site will be at `https://sumith9803.github.io/sumith-portfolio/`.

GitHub's [Pages quickstart](https://docs.github.com/en/pages/quickstart) has screenshots and current instructions. GitHub Pages supports public repositories on GitHub Free.

## Publish with Netlify

1. Sign in or create an account at Netlify.
2. Open the [Netlify Drop publisher](https://app.netlify.com/drop).
3. Drag this whole folder into the publisher. Keep `index.html` at the folder root.
4. Netlify will provide a live URL. Claim the site in your account so you can manage and update it later.

Netlify's [manual deploy guide](https://docs.netlify.com/deploy/create-deploys/) describes folder uploads. No build command is needed for this static site.

## Publish future edits

After editing, download the new `content.json`, replace the hosted site's old copy, and upload/push the updated folder again. Changes saved only in your browser are private to that browser until you download and redeploy them.
