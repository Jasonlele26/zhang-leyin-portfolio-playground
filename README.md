# Zhang Leyin Portfolio

Public static portfolio based on the original NTU portfolio.

## Local build

```sh
npm run build
npm run check
```

The public output is written to `dist/`.

## Publish with Cloudflare Pages

1. Create an empty GitHub repository.
2. Commit and push this folder to the repository's `main` branch.
3. In Cloudflare, open `Workers & Pages`.
4. Choose `Create application` -> `Pages` -> `Connect to Git`.
5. Select the repository and the `main` branch.
6. Use these build settings:

```text
Framework preset: None
Build command: npm run build
Build output directory: dist
Root directory: /
```

7. Deploy and open the generated `https://<project>.pages.dev` address.

The build removes `editor.html`, `editor.css`, `editor.js` and the editor link
from the public site. The source folder remains editable locally.

## Public release checks

- Homepage loads over HTTPS.
- Navigation and hash-based project links work after refresh.
- All images, fonts and downloadable files load.
- Desktop and mobile layouts are usable.
- Public output contains no editor files or credentials.
- A later Git push triggers a new Cloudflare Pages deployment.
