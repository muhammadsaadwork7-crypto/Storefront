# Storefront Admin — Frontend

React + Vite admin panel for the ecommerce backend. Full CRUD UI for
Categories, Suppliers, Products, Users, Orders, and Payments, plus a
Dashboard overview.

Built with a hand-rolled shadcn-style component system (Radix UI primitives +
Tailwind CSS, styled the same way the shadcn/ui CLI would generate them).

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Point the app at your backend:
   ```
   cp .env.example .env
   ```
   By default it expects the backend at `http://localhost:5000/api`. Edit
   `.env` if your backend runs elsewhere:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. Make sure your backend server is running first (see the backend README),
   then start the frontend:
   ```
   npm run dev
   ```

4. Open the URL Vite prints (usually `http://localhost:5173`).

## Folder structure

```
src/
  api/
    axiosClient.js       <- shared axios instance, reads VITE_API_URL
    entity.js             <- createEntityApi() factory: generates get/create/update/remove
    entities.js            <- one line per table wiring up the factory
  components/
    ui/                     <- shadcn-style primitives: Button, Input, Dialog, Select, Badge, etc.
    layout/                  <- Sidebar, Topbar, AppShell
    DataTable.jsx             <- generic searchable table w/ loading + empty states
    FormDialog.jsx             <- generic add/edit form, driven by a field config array
    DeleteConfirmDialog.jsx     <- generic delete confirmation
    PageHeader.jsx                <- title + "Add" button
    ErrorBanner.jsx                <- shown when a page fails to load data
  hooks/
    useEntityCrud.js               <- manages list/loading/dialogs/toasts for any entity
  pages/
    Dashboard.jsx, Categories.jsx, Suppliers.jsx, Products.jsx,
    Users.jsx, Orders.jsx, Payments.jsx
  App.jsx                            <- routes
  main.jsx                            <- entry point
```

## How the CRUD pattern works

Each page (e.g. `Categories.jsx`) is mostly configuration, not logic:

```jsx
const columns = [ /* what to show in the table */ ];
const fields  = [ /* what to show in the add/edit form */ ];

const crud = useEntityCrud(categoriesApi, { entityLabel: "Category" });
```

`useEntityCrud` handles loading state, opening/closing the add/edit dialog,
save/create/update calls, delete confirmation, and toast notifications. To
add a 7th entity, copy any existing page, swap the API import, and adjust
`columns` / `fields`.

Form fields support `text`, `number`, `email`, `password`, `textarea`, and
`select` (with an `options` array) — see `Products.jsx` or `Orders.jsx` for
examples of select fields sourced from another entity's API (e.g. product's
category dropdown).

## Known limitation — order line items

The backend's order creation endpoint accepts an `items` array to compute
`total_amount`. This UI's Orders form currently only sets `user_id` and
`status` — new orders will show a $0 total until line items are added via
the API directly. Wiring up a line-item picker in the Orders form (product +
quantity rows) is a natural next step once the base CRUD is working end to
end.

## Design notes

- Accent color: signal violet (`--primary`)
- Sidebar: dark slate ink, grouped navigation (Catalog / Operations / People)
- Type: Plus Jakarta Sans (UI text), JetBrains Mono (IDs, prices, quantities)
- Status badges use color + a small dot indicator (pending = amber, success
  states = emerald, destructive = rose)
