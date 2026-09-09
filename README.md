# Personal Finance Dashboard

Ένα σύστημα διαχείρισης οικονομικών, με έλεγχο εσόδων και εξόδων, αλλά και χρήσιμα στατιστικά, για τη συμβολή στην απλή διαχείριση των προσωπικών οικονομικών.

## Features

- Authentication μέσω JWT και authorization μέσω ελέγχου ownership των δεδομένων
- Δημιουργία, ανάκτηση, επεξεργασία και διαγραφή κατηγοριών
- Δημιουργία, ανάκτηση, επεξεργασία και διαγραφή συναλλαγών
- Στατιστικά ανά κατηγορία, ανά μήνα και πρόσφατες συναλλαγές

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Authentication: JWT, bcrypt
- Validation: Zod

## Getting Started

### Prerequisites

Για το σύνολο του project απαιτείται

- Node.js (στη συγκεκριμένη περίπτωση χρησιμοποιήθηκε v24.13.0)
- npm (στη συγκεκριμένη περίπτωση χρησιμοποιήθηκε v11.6.2)
- PostgreSQL Server (στη συγκεκριμένη περίπτωση χρησιμοποιήθηκε v18.3)
- pgAdmin (προαιρετικά, για ευκολότερη διαχείριση της βάσης)
- Να έχετε κάνει `git clone ...` και `cd {project folder}`

### Installation

Αφού έχετε όλα τα προαπαιτούμενα, πρέπει να κάνετε τα παρακάτω για να κατεβαστούν όλες οι απαιτούμενες βιβλιοθήκες:

```bash
cd backend
npm install
cd ../frontend
npm install
```

### Setting up the database

Ανοίγετε τον local server σας από το pgAdmin, δημιουργήστε μία database με όνομα "personal_finance" και τρέχετε το database.sql file. Η βάση δεδομένων σας είναι έτοιμη.

### Configuring the project

Το configuration είναι ένα απλό `.env` file στο backend, όπου αντιγράφετε το `.env.example` ως `.env` και συμπληρώνετε τις απαιτούμενες τιμές. Συμπληρώνετε ως εξής:

- `PORT` = Η θύρα στην οποία τρέχει το backend.
- `DB_HOST` = O host της βάσης, στη συγκεκριμένη περίπτωση θα είναι localhost.
- `DB_PORT` = Η θύρα στην οποία τρέχει η βάση, συνήθως είναι 5432.
- `DB_NAME` = Το όνομα της βάσης, το οποίο θα είναι `personal_finance`, ή ό,τι άλλο επιλέξατε στην δημιουργία της βάσης.
- `DB_USER` = Το όνομα χρήστη της βάσης, συνήθως είναι postgres.
- `DB_PASSWORD` = Ο κωδικός του χρήστη της βάσης.
- `JWT_SECRET` = Το μυστικό κλειδί για τα JWT Tokens

**ΠΡΟΣΟΧΗ! ΔΕΝ ΜΟΙΡΑΖΟΜΑΣΤΕ .env ΑΡΧΕΙΑ!**

### Running the project

Αφού τα έχετε κάνει όλα τα προηγούμενα, μπορείτε να τρέξετε (έστω ότι βρίσκεστε στο `/project` directory):

```bash
cd backend
npm run dev
cd ../frontend
npm run dev
```

Αν δεν είναι ανοικτός ο server της βάσης, ανοίξτε τον από το pgAdmin.

## Ανάλυση της Database

Η βάση δεδομένων όπως έχει προαναφερθεί, χρησιμοποιεί την PostgreSQL. Ας αναλύσουμε όμως και τους πίνακες και τα δεδομένα που χρησιμοποιούν

### Table: users

Ο πίνακας users είναι ο κορμός της βάσης. Οι πίνακες `categories` και `transactions` συνδέονται με τον πίνακα users μέσω Foreign Keys. Αποθηκεύει τα παρακάτω δεδομένα:

1. `id`, δηλαδή το Primary Key (βασικό κλειδί) που διαφοροποιεί το κάθε στοιχείο από όλα τα άλλα.
2. `email`, για λόγους auth. Πρέπει να είναι μοναδική η τιμή του email για κάθε χρήστη.
3. `password_hash`, πάλι για λόγους auth. Δεν αποθηκεύεται η πραγματική τιμή του password για λόγους ασφαλείας, όμως αποθηκεύεται το hash για να μπορεί να γίνει με ασφάλεια η διαδικασία του auth
4. `created_at`, timestamp δημιουργίας του λογαριασμού

### Table: categories

Ο πίνακας categories ασχολείται με τις κατηγορίες των εσόδων/εξόδων του κάθε χρήστη. Δηλαδή, η κάθε κατηγορία ανήκει σε έναν χρήστη, ενώ ο κάθε χρήστης μπορεί να έχει πολλές κατηγορίες. Αποθηκεύει τα παρακάτω δεδομένα:

1. `id`, πάλι το Primary Key.
2. `user_id`, το Foreign Key που δίνει αναφορά σε ποιον χρήστη ανήκει
3. `name`, το όνομα του στοιχείου
4. `type`, το είδος συναλλαγών που καλύπτει, δηλαδή `income` ή `expense`

### Table: transactions

Ο πίνακας transactions ασχολείται με τις συναλλαγές του κάθε χρήστη. Δηλαδή, η κάθε συναλλαγή ανήκει σε έναν χρήστη και σε μία κατηγορία. Ο κάθε χρήστης και κατηγορία μπορούν να έχουν πολλές συναλλαγές. Αποθηκεύει τα παρακάτω δεδομένα:

1. `id`, το Primary Key
2. `user_id`, το Foreign Key που αναφέρεται στον αντίστοιχο user που έκανε τη συναλλαγή
3. `category_id`, το Foreign Key που αναφέρεται στην κατηγορία στην οποία ανήκει η συναλλαγή
4. `amount`, το ποσό της συναλλαγής, με 2 δεκαδικά ψηφία ακρίβειας
5. `type`, ο τύπος της συναλλαγής, income ή expense
6. `description`, σχόλια για τη συναλλαγή
7. `date`, η ημερομηνία της συναλλαγής
8. `created_at`, timestamp δημιουργίας της συναλλαγής

## Ανάλυση του API

Το API αποτελείται από τέσσερις βασικές ενότητες:

- **Authentication** — Διαχείριση χρηστών και authentication μέσω JWT.
- **Categories** — Διαχείριση των κατηγοριών του κάθε χρήστη.
- **Transactions** — Δημιουργία, ανάκτηση, τροποποίηση και διαγραφή οικονομικών συναλλαγών.
- **Dashboard** — Ανάκτηση συγκεντρωτικών οικονομικών δεδομένων.

Τα endpoints που διαχειρίζονται δεδομένα χρηστών προστατεύονται μέσω του `authMiddleware`.

---

### Authentication

Το authentication βασίζεται στα:

- **bcrypt** για hashing και έλεγχο των passwords.
- **JWT (JSON Web Token)** για authentication.
- **Zod** για validation των δεδομένων εισόδου.
- **PostgreSQL** για την αποθήκευση των χρηστών.

#### POST /login

Χρησιμοποιείται για τη σύνδεση ενός υπάρχοντος χρήστη.

Αρχικά γίνεται validation του request body μέσω του `registerSchema`. Στη συνέχεια, αναζητείται ο χρήστης στη βάση δεδομένων με βάση το email.

Το password που εισάγει ο χρήστης συγκρίνεται με το αποθηκευμένο password hash μέσω του `bcrypt.compare()`.

Εάν τα credentials είναι σωστά, δημιουργείται ένα JWT token μέσω του `jwt.sign()`.

Το JWT περιέχει το `userId` του χρήστη και έχει διάρκεια ισχύος **1 ώρα**.

**Success response:** `200 OK`

```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN"
}
```

**Possible responses:**

| Status | Περιγραφή                 |
| ------ | ------------------------- |
| `400`  | Validation failed         |
| `401`  | Invalid email or password |
| `500`  | Internal server error     |

#### POST /register

Χρησιμοποιείται για τη δημιουργία νέου χρήστη.

Το request body ελέγχεται μέσω του `registerSchema`. Στη συνέχεια ελέγχεται αν υπάρχει ήδη χρήστης με το συγκεκριμένο email.

Εάν το email δεν υπάρχει, το password γίνεται hash μέσω του `bcrypt` και αποθηκεύεται στη βάση δεδομένων μαζί με το email.

**Success response:** `201 Created`

Η βάση επιστρέφει τα:

- `id`
- `email`
- `created_at`

**Possible responses:**

| Status | Περιγραφή                   |
| ------ | --------------------------- |
| `400`  | Validation failed           |
| `409`  | Email is already registered |
| `500`  | Internal server error       |

#### GET /me

Ελέγχει αν ο χρήστης είναι authenticated.

Το endpoint προστατεύεται από το `authMiddleware`. Το middleware επαληθεύει το JWT και προσθέτει τα στοιχεία του χρήστη στο `req.user`.

**Success response:** `200 OK`

```json
{
  "message": "You are authenticated",
  "userId": 1
}
```

---

### Categories

Οι categories συνδέονται με έναν συγκεκριμένο χρήστη μέσω του `user_id`.

Όλες οι λειτουργίες των categories απαιτούν authentication.

#### POST /

Δημιουργεί μία νέα category για τον authenticated user.

Το `user_id` δεν προέρχεται από το request body. Αντίθετα, λαμβάνεται από το `req.user.id`, το οποίο έχει δημιουργηθεί από το `authMiddleware`.

Τα δεδομένα ελέγχονται μέσω του `categorySchema`.

**Request body:**

```json
{
  "name": "Food",
  "type": "expense"
}
```

**Success response:** `201 Created`

Το API επιστρέφει:

- `id`
- `user_id`
- `name`
- `type`

#### GET /

Επιστρέφει όλες τις categories του authenticated user.

Τα αποτελέσματα ταξινομούνται αλφαβητικά με βάση το `name`.

**Success response:** `200 OK`

```json
{
  "categories": [
    {
      "id": 1,
      "name": "Food",
      "type": "expense"
    }
  ]
}
```

#### PATCH /:id

Ενημερώνει μία υπάρχουσα category.

Αρχικά ελέγχεται ότι το `id` είναι θετικός ακέραιος. Στη συνέχεια γίνεται validation του request body μέσω του `categorySchema`.

Η SQL εντολή περιλαμβάνει τόσο το `id` της category όσο και το `user_id` του authenticated user:

```sql
WHERE id = $3 AND user_id = $4
```

Με αυτόν τον τρόπο ένας χρήστης δεν μπορεί να τροποποιήσει category που ανήκει σε άλλον χρήστη.

**Possible responses:**

| Status | Περιγραφή                       |
| ------ | ------------------------------- |
| `200`  | Η category ενημερώθηκε επιτυχώς |
| `400`  | Invalid ID ή validation failed  |
| `404`  | Category not found              |
| `500`  | Internal server error           |

#### DELETE /:id

Διαγράφει μία category.

Η διαγραφή γίνεται μόνο εάν η category ανήκει στον authenticated user.

Η SQL εντολή χρησιμοποιεί:

```sql
DELETE FROM categories
WHERE id = $1 AND user_id = $2
```

**Possible responses:**

| Status | Περιγραφή                      |
| ------ | ------------------------------ |
| `200`  | Η category διαγράφηκε επιτυχώς |
| `400`  | Invalid category ID            |
| `404`  | Category not found             |
| `500`  | Internal server error          |

---

### Transactions

Οι transactions αντιπροσωπεύουν τις οικονομικές συναλλαγές του χρήστη.

Κάθε transaction συνδέεται με:

- έναν user μέσω του `user_id`
- μία category μέσω του `category_id`

Μία transaction περιλαμβάνει τα πεδία:

```text
id
user_id
category_id
amount
type
description
date
created_at
```

#### POST /

Δημιουργεί μία νέα transaction.

Αρχικά γίνεται validation μέσω του `transactionSchema`.

Στη συνέχεια ελέγχεται ότι η category που δόθηκε ανήκει στον authenticated user:

```sql
SELECT id
FROM categories
WHERE id = $1 AND user_id = $2
```

Μόνο εφόσον η category ανήκει στον χρήστη δημιουργείται η transaction.

**Request body:**

```json
{
  "categoryId": 1,
  "amount": 25.5,
  "type": "expense",
  "description": "Lunch",
  "date": "2026-09-07"
}
```

Το `user_id` λαμβάνεται από το `req.user.id` και δεν αποστέλλεται από τον client.

**Success response:** `201 Created`

Το API επιστρέφει τα στοιχεία της νέας transaction μαζί με το `created_at`.

#### GET /

Επιστρέφει όλες τις transactions του authenticated user.

Χρησιμοποιείται `JOIN` με τον πίνακα `categories`, ώστε τα αποτελέσματα να περιλαμβάνουν και τα στοιχεία της αντίστοιχης category.

Οι transactions ταξινομούνται με βάση την ημερομηνία από τη νεότερη προς την παλαιότερη.

#### GET /:id

Επιστρέφει μία συγκεκριμένη transaction.

Το API ελέγχει ταυτόχρονα το `id` της transaction και το `user_id`:

```sql
WHERE id = $1 AND user_id = $2
```

Έτσι, ένας χρήστης δεν μπορεί να αποκτήσει πρόσβαση σε transaction άλλου χρήστη.

**Possible responses:**

| Status | Περιγραφή              |
| ------ | ---------------------- |
| `200`  | Η transaction βρέθηκε  |
| `400`  | Invalid transaction ID |
| `404`  | Transaction not found  |
| `500`  | Internal server error  |

#### PATCH /:id

Ενημερώνει μία υπάρχουσα transaction.

Το endpoint υποστηρίζει partial updates. Αυτό σημαίνει ότι ο client μπορεί να στείλει μόνο τα fields που θέλει να τροποποιήσει.

Τα επιτρεπόμενα fields είναι:

```text
categoryId
amount
type
description
date
```

Το API δημιουργεί δυναμικά το `SET` μέρος του SQL query μόνο για τα fields που έχουν αποσταλεί.

Παράλληλα, τα fields που επιτρέπεται να τροποποιηθούν είναι συγκεκριμένα και δεν χρησιμοποιείται αυθαίρετο field από τον client.

Εάν αλλάξει το `categoryId`, γίνεται επιπλέον έλεγχος ώστε η νέα category να ανήκει στον ίδιο authenticated user.

> Σημείωση: Το συγκεκριμένο endpoint ελέγχει ποια fields επιτρέπεται να τροποποιηθούν, αλλά δεν εφαρμόζει το ίδιο Zod validation που εφαρμόζεται κατά τη δημιουργία μιας transaction.

#### DELETE /:id

Διαγράφει μία transaction.

Η διαγραφή πραγματοποιείται μόνο εφόσον η transaction ανήκει στον authenticated user.

```sql
DELETE FROM transactions
WHERE id = $1 AND user_id = $2
```

**Possible responses:**

| Status | Περιγραφή                         |
| ------ | --------------------------------- |
| `200`  | Η transaction διαγράφηκε επιτυχώς |
| `400`  | Invalid transaction ID            |
| `404`  | Transaction not found             |
| `500`  | Internal server error             |

---

### Dashboard

Το Dashboard παρέχει συγκεντρωτικά δεδομένα σχετικά με τα οικονομικά του χρήστη.

Σε αντίθεση με τα Categories και Transactions, τα συγκεκριμένα endpoints είναι **read-only** και χρησιμοποιούνται για την παρουσίαση υπολογισμένων δεδομένων.

#### GET /summary

Επιστρέφει:

- συνολικό income
- συνολικό expense
- balance

Το balance υπολογίζεται στον server:

```text
balance = totalIncome - totalExpenses
```

Για τον υπολογισμό χρησιμοποιείται το PostgreSQL `SUM()` μαζί με `COALESCE()` ώστε, όταν δεν υπάρχουν transactions, το αποτέλεσμα να είναι `0` αντί για `NULL`.

**Response:**

```json
{
  "totalIncome": 2500,
  "totalExpenses": 850,
  "balance": 1650
}
```

#### GET /expenses-by-category

Επιστρέφει τα συνολικά expenses για κάθε category του χρήστη.

Χρησιμοποιείται `LEFT JOIN` μεταξύ `categories` και `transactions`.

Αυτό επιτρέπει να εμφανίζονται και categories στις οποίες δεν υπάρχει κάποιο expense transaction. Σε αυτή την περίπτωση το συνολικό ποσό είναι `0`.

Τα αποτελέσματα ομαδοποιούνται ανά category και ταξινομούνται από το μεγαλύτερο συνολικό expense προς το μικρότερο.

#### GET /monthly

Επιστρέφει τα συνολικά income και expenses ανά μήνα.

Για την ομαδοποίηση χρησιμοποιείται το PostgreSQL:

```sql
DATE_TRUNC('month', date)
```

Στη συνέχεια ο μήνας μετατρέπεται στη μορφή:

```text
YYYY-MM
```

Για παράδειγμα:

```text
2026-07
2026-08
2026-09
```

Για κάθε μήνα υπολογίζονται ξεχωριστά τα income και τα expenses μέσω conditional aggregation.

#### GET /recent-transactions

Επιστρέφει τις **10 πιο πρόσφατες transactions** του authenticated user.

Τα αποτελέσματα ταξινομούνται πρώτα με βάση το `date` και στη συνέχεια με βάση το `created_at`:

```sql
ORDER BY date DESC, created_at DESC
```

Το `created_at` λειτουργεί ως tie-breaker όταν δύο transactions έχουν την ίδια ημερομηνία.

Ο αριθμός των αποτελεσμάτων περιορίζεται σε 10 μέσω:

```sql
LIMIT 10
```

---

### Authentication Flow

Η διαδικασία authentication λειτουργεί ως εξής:

```text
Client
  │
  │ POST /login
  ▼
Server
  │
  ├── Validate credentials
  │
  ├── Find user in PostgreSQL
  │
  ├── bcrypt.compare()
  │
  └── Generate JWT
          │
          ▼
      JWT Token
          │
          │ Authorization: Bearer <token>
          ▼
    authMiddleware
          │
          ▼
       req.user
          │
          ├── Categories
          ├── Transactions
          └── Dashboard
```

Το `userId` του JWT χρησιμοποιείται από τα protected endpoints για να φιλτράρονται τα δεδομένα του authenticated user.

Έτσι, οι queries για categories και transactions περιορίζονται στα δεδομένα του συγκεκριμένου χρήστη.

---

### CRUD Overview

| Resource     | Create           | Read                                                                                    | Update       | Delete        |
| ------------ | ---------------- | --------------------------------------------------------------------------------------- | ------------ | ------------- |
| Users        | `POST /register` | —                                                                                       | —            | —             |
| Categories   | `POST /`         | `GET /`                                                                                 | `PATCH /:id` | `DELETE /:id` |
| Transactions | `POST /`         | `GET /`, `GET /:id`                                                                     | `PATCH /:id` | `DELETE /:id` |
| Dashboard    | —                | `GET /summary`, `GET /expenses-by-category`, `GET /monthly`, `GET /recent-transactions` | —            | —             |

> Οι τελικές διαδρομές των routes εξαρτώνται από το prefix με το οποίο γίνεται mount κάθε Express router στο βασικό αρχείο του server.

---

### Data Isolation

Ένα σημαντικό χαρακτηριστικό του API είναι η απομόνωση των δεδομένων ανά χρήστη.

Το `user_id` δεν εμπιστεύεται δεδομένα που στέλνει ο client. Αντίθετα, λαμβάνεται από το authenticated JWT μέσω του `req.user.id`.

Για παράδειγμα, η αναζήτηση μιας transaction χρησιμοποιεί:

```sql
WHERE id = $1 AND user_id = $2
```

Αυτό σημαίνει ότι ακόμη και αν κάποιος γνωρίζει το `id` μιας transaction άλλου χρήστη, δεν μπορεί να την ανακτήσει, να την τροποποιήσει ή να τη διαγράψει μέσω του API.

Το ίδιο μοντέλο εφαρμόζεται και στις categories.

---

### SQL Security

Τα SQL queries χρησιμοποιούν **parameterized queries** με placeholders όπως:

```sql
WHERE id = $1 AND user_id = $2
```

και οι τιμές περνούν ξεχωριστά:

```javascript
[transactionId, userId];
```

Αυτό μειώνει τον κίνδυνο SQL injection, καθώς οι τιμές του χρήστη δεν ενσωματώνονται απευθείας στο SQL string.

## Design Decisions

### Γιατί PostgreSQL και Express.js;

Χρησιμοποιήθηκε η PostgreSQL επειδή το project βασίζεται σε σχετιζόμενα δεδομένα, όπως users, categories και transactions. Ως relational database επιτρέπει την οργάνωση αυτών των σχέσεων μέσω Primary Keys και Foreign Keys.

Για το backend χρησιμοποιήθηκε το Express.js, καθώς παρέχει ένα απλό και ευέλικτο framework για τη δημιουργία REST API σε Node.js και διευκολύνει την οργάνωση των routes και του middleware.

### Γιατί React χωρίς Tailwind, αλλά με απλό CSS;

Το frontend χρησιμοποιεί React με απλό CSS, καθώς ο κύριος στόχος του project είναι η υλοποίηση και παρουσίαση του backend και του API.

Το React είναι αρκετό για τη δημιουργία του απαραίτητου interface, χωρίς να χρειάζεται επιπλέον CSS framework όπως το Tailwind CSS.

### Γιατί JavaScript και Node.js για το Backend;

Χρησιμοποιήθηκε JavaScript και στο backend μέσω του Node.js, ώστε να υπάρχει κοινή γλώσσα προγραμματισμού μεταξύ frontend και backend.

Επιπλέον, το Node.js είναι κατάλληλο για τη δημιουργία web APIs και, σε συνδυασμό με το Express.js, επιτρέπει την απλή και οργανωμένη υλοποίηση του backend.
