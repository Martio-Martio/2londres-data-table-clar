# `@2londres/data-table-clar`

Table **TanStack Table** : filtres en en-tête, pagination compacte (pages + ellipses + « aller à la page »), export CSV (page courante ou liste complète), mode **client** ou **serveur**.

**Guide d'utilisation** — ce document décrit l'installation, les props, des exemples copiables et les pièges courants.

<!-- GIF : démo globale du composant -->
![Démo DataTableClar](./assets/demo-overview.gif)

---

## Sommaire

1. [Intégration (ce dépôt vs npm)](#intégration-ce-dépôt-vs-npm)
2. [Prérequis](#prérequis)
3. [Démarrage rapide — mode client](#démarrage-rapide--mode-client)
4. [Mode serveur — filtres & pagination](#mode-serveur--filtres--pagination)
5. [Référence des props `DataTableClar`](#référence-des-props-datatableclar)
6. [Colonnes, `meta` et filtres UI](#colonnes-meta-et-filtres-ui)
7. [États chargement / erreur / vide](#états-chargement--erreur--vide)
8. [Sélection de lignes](#sélection-de-lignes)
9. [Export CSV](#export-csv)
10. [Internationalisation (i18n)](#internationalisation-i18n)
11. [Package vs application (filtres API)](#package-vs-application-filtres-api)
12. [API exportée](#api-exportée)
13. [Publication npm & peers](#publication-npm--peers)
14. [Tailwind](#tailwind)

---

## Intégration (ce dépôt vs npm)

### Dans **Process-Maker** (alias, sans `npm install` du package)

- **Vite** [`vite.config.ts`](../../vite.config.ts) : `resolve.alias["@2londres/data-table-clar"]` → `./packages/data-table-clar/src/index.ts`
- **TypeScript** [`tsconfig.app.json`](../../tsconfig.app.json) : `paths["@2londres/data-table-clar"]` → le même fichier

Écrans métier (recommandé) :

```ts
import { DataTableClar } from "@/components/shared/DataListTable/dataTableClar";
```

Le wrapper réinjecte les comportements banque (droits CSV, notifications, `LoadScreen`, `EmptyTable` / `ErrorTable` / `LoadingTable`).

### Import **direct** du package (lib seule)

```ts
import { DataTableClar } from "@2londres/data-table-clar";
```

### Après publication **npm**

```bash
cd packages/data-table-clar && npm install && npm run build && npm publish
```

Les entrées `main` / `exports` du `package.json` pointent vers `dist/` une fois le build exécuté.

---

## Prérequis

| Besoin | Détail |
|--------|--------|
| **React 18+** | Composants client (`"use client"` côté Next si besoin). |
| **`react-router-dom`** | `columnsClar` reçoit `navigate` pour les liens / actions dans les cellules. |
| **`react-i18next`** | Le package appelle `useTranslation()` ; fournir un `I18nextProvider` et les clés listées [plus bas](#internationalisation-i18n). |
| **TanStack Table** | Déjà une peer du package ; les colonnes sont des `ColumnDef`. |
| **Styles** | Tailwind (ou équivalent) : le package utilise des classes utilitaires (`shadcn`-like). |

---

## Démarrage rapide — mode client

Idéal quand **toutes les lignes** sont déjà chargées dans `data` (filtrage + pagination **locaux** TanStack).

<!-- GIF : mode client — filtres locaux + pagination -->
![Mode client](./assets/demo-client-mode.gif)

```tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableClar } from "@2londres/data-table-clar";

type Row = { id: string; name: string };

const buildColumns = (_navigate: ReturnType<typeof useNavigate>): ColumnDef<Row, unknown>[] => [
  {
    id: "name",
    accessorKey: "name",
    header: "Nom",
    meta: { type: "text" },
  },
];

export function MyListPage() {
  const navigate = useNavigate();
  const [data] = useState<Row[]>([{ id: "1", name: "Alpha" }]);

  const columnsClar = useMemo(() => buildColumns, []);

  return (
    <DataTableClar<Row>
      title="Ma liste"
      exportFileName="export"
      data={data}
      columnsClar={columnsClar}
      itemPerPage={10}
      // paginationMode omis → "client"
    />
  );
}
```

- Chaque ligne doit avoir un **`id: string`** stable (obligatoire pour les clés React et la sélection).
- **`exportFileName`** : préfixe du fichier CSV téléchargé.

---

## Mode serveur — filtres & pagination

Quand les données viennent d'une **API** paginée et/ou filtrée.

<!-- GIF : mode serveur — pagination + filtres API -->
![Mode serveur](./assets/demo-server-mode.gif)

### Props obligatoires côté tableau

- `paginationMode="server"`
- `pagination` + `onPaginationChange` (état contrôlé, ex. `useState`)
- `columnFilters` + `onColumnFiltersChange`
- `serverPageCount` : nombre de pages renvoyé par l'API (0 si aucune page)
- `totalItemsCount` : total d'éléments pour le compteur sous le titre

### Ce que fait **ton** code (hors package)

1. Stocker `pagination` et `columnFilters` (souvent `useState`).
2. À chaque changement, **mapper** `columnFilters` → query params / body attendus par ton API.
3. Lancer la requête (ex. **React Query**) avec `page`, `limit` dérivés de `pagination.pageIndex` / `pagination.pageSize`.
4. Passer **`data`** = page courante, **`serverPageCount`**, **`totalItemsCount`** depuis la réponse.

### Exemple minimal (schéma)

```tsx
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

// Dans ton useQuery / queryFn :
const apiParams = {
  page: pagination.pageIndex + 1,
  limit: pagination.pageSize,
  ...mapColumnFiltersToApi(columnFilters), // à implémenter dans ton app
};

<DataTableClar<Row>
  paginationMode="server"
  pagination={pagination}
  onPaginationChange={setPagination}
  columnFilters={columnFilters}
  onColumnFiltersChange={setColumnFilters}
  serverPageCount={meta.totalPages}
  totalItemsCount={meta.totalItems}
  data={rows}
  columnsClar={columnsClar}
  title="Liste"
  exportFileName="liste"
/>
```

### Colonnes sans filtre API

Utilise `meta: { type: "denied" }` pour **ne pas afficher** de contrôle de filtre sur une colonne (souvent après mapping automatique de tes définitions de colonnes).

### Avertissement dev

Si `pagination` est contrôlé en mode serveur **sans** `columnFilters` / `onColumnFiltersChange`, un `console.warn` peut s'afficher : branche bien les deux.

---

## Référence des props `DataTableClar`

Props principales (voir `DataTableClarProps` dans le code pour la liste exhaustive).

| Prop | Type | Description |
|------|------|-------------|
| `data` | `TData[]` | Lignes affichées (page courante en mode serveur). |
| `title` | `string` | Titre de la carte. |
| `exportFileName` | `string` | Préfixe des fichiers CSV. |
| `columnsClar` | `(navigate) => ColumnDef[]` | Définition des colonnes ; `navigate` pour actions/liens. |
| `itemPerPage` | `number?` | Taille de page initiale / attendue. |
| `paginationMode` | `"client" \| "server"?` | Défaut `"client"`. |
| `pagination` | `PaginationState?` | `{ pageIndex, pageSize }` — **requis** en serveur contrôlé. |
| `onPaginationChange` | `OnChangeFn` | **Requis** en serveur contrôlé. |
| `columnFilters` | `ColumnFiltersState?` | Filtres TanStack — **requis** côté serveur si tu filtres. |
| `onColumnFiltersChange` | `OnChangeFn` | Idem. |
| `serverPageCount` | `number?` | Nombre total de pages (serveur). |
| `totalItemsCount` | `number?` | Total éléments (serveur). |
| `loading` | `{ isLoading, loaderComponent?, isFetching? }?` | Skeleton + indicateur de refetch. |
| `error` | `{ message, refetch? }?` | Affichage erreur + option recharge. |
| `enableSelection` | `boolean?` | Colonne cases à cocher. |
| `onSelectionChange` | `(ids: string[]) => void` | IDs sélectionnés. |
| `onExportFullList` | `() => Promise<TData[]>` | Export CSV « liste complète » en mode serveur. |
| `showCsvExportButton` | `boolean?` | Affiche le bouton CSV (souvent `false` par défaut dans le package ; le wrapper Process-Maker lie l'admin). |
| `enableClientVolumeControl` | `boolean?` | Mode client : sélecteur « volume » + cookie (désactivable). |
| `renderVolumeControl` | `ReactNode?` | Remplace le sélecteur de volume intégré. |
| `onNotifyWarning` / `onNotifyError` / `onNotifyInfo` | callbacks | Feedback export / volume (si pas de wrapper app). |
| `renderLoading` / `renderEmpty` / `renderError` | fonctions | Personnalise les états (le wrapper Process-Maker fournit les tabs par défaut). |
| `renderCsvExportLoading` | `() => ReactNode` | Overlay pendant l'export async liste complète. |

---

## Colonnes, `meta` et filtres UI

Les filtres en tête suivent `columnDef.meta` (`DataTableColumnMetaType`) :

<!-- GIF : types de filtres (text, date, select) -->
![Filtres colonnes](./assets/demo-column-filters.gif)

| `meta.type` | Comportement |
|-------------|----------------|
| `"text"` | Champ texte ; valeur filtre = `string`. |
| `"date"` | `input type="date"` ; valeur `YYYY-MM-DD`. |
| `"date_from"` / `"date_end"` | Plage : valeur souvent `{ from?, to? }` selon ta logique. |
| `"select"` | `meta.options: { value, label }[]` ; pour tout afficher, une option `value: "Tout"` vide le filtre. |
| `"denied"` | Pas de contrôle (ex. pas de filtre API). |
| `"selection"` | Réservé à la colonne de sélection interne. |

**Alignement** : `headerAlign`, `cellAlign` : `"left"` \| `"center"` \| `"right"`.

**Filtre date plage côté client** : exporter `dateRangeFilterFn` du package dans `columnDef.filterFn` si tu filtres localement sur une colonne date.

---

## États chargement / erreur / vide

<!-- GIF : états loading → empty → error -->
![États chargement / erreur / vide](./assets/demo-loading-states.gif)

- **`loading.isLoading`** : affiche le skeleton (ou `loaderComponent`) **à la place des lignes**.
- **`loading.isFetching`** + `data.length === 0`** : même chose (chargement initial).
- **`loading.isFetching`** + données présentes : le tableau reste affiché ; une barre d'indication de refetch peut apparaître en bas (comportement du package).
- **`error.message`** : affiche l'état erreur ; `refetch` affiche un bouton de retry si fourni.

Personnalisation : `renderLoading`, `renderEmpty`, `renderError`.

---

## Sélection de lignes

<!-- GIF : sélection checkbox + callback -->
![Sélection de lignes](./assets/demo-row-selection.gif)

```tsx
<DataTableClar
  enableSelection
  onSelectionChange={(ids) => console.log(ids)}
  // ...
/>
```

Les IDs correspondent à `row.original.id` : chaque ligne doit avoir un **`id` unique**.

---

## Export CSV

<!-- GIF : export CSV page courante + liste complète -->
![Export CSV](./assets/demo-csv-export.gif)

- **`showCsvExportButton`** : affiche le bouton (à brancher sur tes droits métier).
- Dialogue : page courante **ou** liste complète.
- **Client** : liste complète = toutes les lignes filtrées en mémoire (`getPrePaginationRowModel` côté implémentation).
- **Serveur** : liste complète = **`onExportFullList`** doit retourner une `Promise` des lignes (souvent un fetch avec les mêmes filtres que la liste). Plafond : `DATA_TABLE_EXPORT_MAX_ROWS` / `clampExportLimit`.

---

## Internationalisation (i18n)

Le package utilise **`useTranslation()`** sans namespace imposé. Prévoir au minimum des clés du type :

- `dataTable*`, `dataTableCsvExport*`, `dataTablePagination*`, `dataTableFilter*`, `dataTableVolume*`, `dataTableResetFilters`, `dataTableNoSelectOptions`, …
- `selectAll`, `loadingText`, `cancel`, `previous`, `next`, `loadErrorDescription`, `noDataToExport`
- Textes table vides / erreurs si tu utilises les composants par défaut du package : `noTableDataToDisplay`, `tableErrorText`, `reload`, etc.

Copier les entrées depuis les fichiers de locales du projet hôte ou les redéfinir.

---

## Package vs application (filtres API)

| Couche | Rôle |
|--------|------|
| **Package** | UI des filtres selon `meta`, état TanStack `columnFilters` / `pagination`, pagination visuelle, export. |
| **Ton app** | Contrat API : transformation `ColumnFiltersState` → paramètres HTTP, désactivation UI (`denied`), clés React Query. |

---

## API exportée

| Catégorie | Exports |
|-----------|---------|
| Composants | `DataTableClar`, `DataTableCsvExportDialog`, `DataTablePaginationBar` |
| Utilitaires | `downloadCsvFromRows`, `clampExportLimit`, `DATA_TABLE_EXPORT_MAX_ROWS`, `getVisiblePaginationSegments`, `dateRangeFilterFn` |
| Types | `DataTableClarProps`, `DataTableColumnMetaType`, `DataTableRowBase`, `DataTableCsvExportScope`, `DataTablePaginationBarProps`, `PaginationSegment`, … |

---

## Publication npm & peers

```bash
cd packages/data-table-clar
npm install
npm run build
npm publish --access public   # si le scope npm est configuré
```

Peers listées dans [`package.json`](./package.json) : `react`, `react-dom`, `@tanstack/react-table`, `react-router-dom`, `react-i18next`, Radix UI, `lucide-react`, `cmdk`, `class-variance-authority`, etc.

---

## Tailwind

Inclure les sources du package dans le **content** / scan des classes Tailwind du consommateur. Dans ce monorepo, l'import via Vite inclut déjà `packages/data-table-clar/src`, donc les classes sont prises en compte au build.

---

## Pièges fréquents

| Problème | Piste |
|----------|--------|
| Filtres serveur sans effet | Vérifier `onColumnFiltersChange` + mapping vers l'API + invalidation / clés de requête. |
| Pagination bloquée | `serverPageCount` cohérent avec l'API (`Math.ceil(total / pageSize)` ou champ `totalPages`). |
| Mauvaise ligne sélectionnée | `getRowId` utilise `row.id` : garantir des **id uniques** côté données. |
| Pas de styles | Scanner les chemins du package dans Tailwind. |
| Export liste complète serveur vide | Implémenter `onExportFullList` ; sinon seule la page courante est exportable. |
