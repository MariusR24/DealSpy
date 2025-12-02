# DealSpy - Agentul Tău pentru Oferte la Jocuri Video

DealSpy este o aplicație web modernă care agregă reduceri la jocuri video de pe majoritatea magazinelor digitale globale (Steam, Epic Games, GOG, Humble Bundle, etc.), ajutând utilizatorii să găsească cele mai bune prețuri în timp real.

## Funcționalități Principale

-   **Agregare în Timp Real:** Preia oferte live folosind API-ul CheapShark.
-   **Sortare Inteligentă (AAA Focus):** Algoritm personalizat care prioritizează titlurile majore (AAA) și cele cu scoruri mari.
-   **Interfață Modernă:** Design responsive (Mobile & Desktop) cu temă întunecată (Dark Mode), fundal animat (Liquid Ether) și tranziții fluide.
-   **Detalii Complete:** Informații despre joc, istoric de preț, trailere video și capturi de ecran (integrate prin CheapShark și RAWG).
-   **Sistem Wishlist Local:** Salvează jocurile favorite în browser (LocalStorage) fără a necesita cont.
-   **Comparare Prețuri:** Vezi prețul actual vs. cel mai mic preț istoric și compară între magazine.
-   **Filtrare Avansată:** Căutare după titlu, preț maxim, rating minim, platformă și categorie.

## Tehnologii Folosite

-   **Frontend:** React 19, TypeScript
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS
-   **Animații:** CSS Keyframes, Three.js (pentru fundal)
-   **Grafice:** Recharts
-   **Date:** CheapShark API (Oferte), Steam CDN (Imagini HQ)

## Cum să rulezi proiectul local

1.  **Instalează dependențele:**
    ```bash
    npm install
    ```

2.  **Pornește serverul de dezvoltare:**
    ```bash
    npm run dev
    ```
    Aplicația va fi disponibilă la `http://localhost:5173`.

3.  **Build pentru producție:**
    ```bash
    npm run build
    ```
    Fișierele statice vor fi generate în folderul `dist`.

## Instrucțiuni de Deployment (Netlify)

Acest proiect este configurat pentru a fi desfășurat (deployed) instantaneu pe Netlify.

1.  Urcă codul sursă pe **GitHub/GitLab/Bitbucket**.
2.  Loghează-te în **Netlify** și apasă pe "Add new site" -> "Import an existing project".
3.  Selectează repository-ul tău.
4.  Netlify va detecta automat setările datorită fișierului `netlify.toml` inclus:
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`
5.  Apasă **Deploy Site**.

### Link Live
După finalizarea pasului de mai sus, Netlify îți va oferi un link public (ex: `https://dealspy-demo.netlify.app`).

## Structură Proiect

*   `src/components`: Componente UI reutilizabile (GameCard, Header, Filters, etc.)
*   `src/services`: Logica de comunicare cu API-urile (gameService.ts)
*   `src/hooks`: Hook-uri personalizate (useLocalStorage)
*   `src/types.ts`: Definiții TypeScript pentru datele aplicației.

---
*Dezvoltat cu pasiune pentru gameri.*
