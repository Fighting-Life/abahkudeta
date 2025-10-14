# 🚀 Complete Database & Composables Setup

## 📋 Overview
This is a complete, clean database setup with all necessary tables, triggers, RLS policies, and composables for your application.

## ✅ What's Included

### Database Schema:
- ✅ **profiles** - User profiles with balance, payment info, roles
- ✅ **transactions** - Deposit & withdrawal management
- ✅ **double_exp_claims** - Double EXP reward system
- ✅ **All triggers** - Auto-create profiles, update balances, etc.
- ✅ **All RLS policies** - Secure row-level security
- ✅ **All functions** - Helper functions for stats, validation

### Composables:
- ✅ **useAuth.ts** - Register, login, logout, password reset
- ✅ **useProfiles.ts** - Profile management, validation
- ✅ **useTransactions.ts** - Transaction CRUD, admin functions
- ✅ **useDoubleExp.ts** - Double EXP claim management

---

## 🔧 Installation Steps

### Step 1: Setup Database

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Click on "SQL Editor" in the left sidebar

2. **Run the Database Setup Script**
   - Copy all content from `complete-database-setup.sql`
   - Paste into SQL Editor
   - Click "Run" button
   - Wait for completion (should show "DATABASE SETUP COMPLETE! 🎉")

3. **Verify Installation**
   - Check the output messages
   - Should show:
     - ✓ Tables created: 3
     - ✓ Triggers: 6
     - ✓ Functions: 9
     - ✓ RLS Policies: multiple

### Step 2: Install Composables

Copy the following files to your project's `composables/` directory:

```
composables/
├── useAuth.ts
├── useProfiles.ts
├── useTransactions.ts
└── useDoubleExp.ts
```

### Step 3: Update Types (Optional but Recommended)

Create or update your `types/database.types.ts` file with the following interfaces:

```typescript
// User Profile
export interface Profile {
  id: string;
  username: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  payment_type: string;
  bank_account_number: string | null;
  bank_account_name: string | null;
  balance: string;
  referral_code: string | null;
  role: 'user' | 'admin' | 'superadmin';
  is_active: boolean;
  bonus_claimed: boolean;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  username: string;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  payment_type?: string;
  bank_account_number?: string | null;
  bank_account_name?: string | null;
  balance?: string;
  referral_code?: string | null;
  role?: 'user' | 'admin' | 'superadmin';
  is_active?: boolean;
  bonus_claimed?: boolean;
}

export interface ProfileUpdate {
  username?: string;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  avatar_url?: string | null;
  payment_type?: string;
  bank_account_number?: string | null;
  bank_account_name?: string | null;
  balance?: string;
  referral_code?: string | null;
  role?: 'user' | 'admin' | 'superadmin';
  is_active?: boolean;
  bonus_claimed?: boolean;
}

// Transaction
export type TransactionType = 'deposit' | 'withdraw';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'rejected';
export type PaymentMethod = 'bank_transfer' | 'e_wallet' | 'crypto' | 'credit_card';

export interface Transaction {
  id: string;
  user_id: string;
  transaction_type: TransactionType;
  amount: number;
  status: TransactionStatus;
  payment_method: PaymentMethod;
  payment_account_number: string | null;
  payment_account_name: string | null;
  payment_provider: string | null;
  user_account_number: string;
  user_account_name: string;
  reference_number: string | null;
  notes: string | null;
  admin_notes: string | null;
  proof_image_url: string | null;
  processed_by: string | null;
  processed_at: string | null;
  balance_before: number | null;
  balance_after: number | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface CreateTransactionInput {
  transaction_type: TransactionType;
  amount: number;
  payment_method: PaymentMethod;
  payment_provider?: string | null;
  user_account_number: string;
  user_account_name: string;
  notes?: string | null;
  proof_image_url?: string | null;
}

export interface UpdateTransactionInput {
  status?: TransactionStatus;
  admin_notes?: string;
  proof_image_url?: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  payment_method?: PaymentMethod;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  search?: string;
}

export interface TransactionHistory extends Transaction {
  username: string | null;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  processed_by_username: string | null;
  processed_by_name: string | null;
}

export interface TransactionStats {
  total_deposits: number;
  total_withdrawals: number;
  pending_deposits: number;
  pending_withdrawals: number;
  total_transactions: number;
  completed_transactions: number;
}

// Double EXP
export interface DoubleExpClaim {
  id: string;
  user_id: string;
  claimed_at: string;
  expires_at: string;
  next_claim_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

---

## 📖 Usage Examples

### Authentication

```vue
<script setup lang="ts">
const { register, login, logout } = useAuth();

// Register
const handleRegister = async () => {
  await register({
    email: 'user@example.com',
    username: 'username',
    password: 'password123',
    name: 'John Doe',
    phone: '08123456789',
    whatsapp: '08123456789',
    payment_type: 'bank',
    payment_method: 'BCA',
    bank_account_number: '1234567890',
    bank_account_name: 'John Doe',
    referral_code: 'REFER123',
  });
};

// Login
const handleLogin = async () => {
  await login('username', 'password123');
};

// Logout
const handleLogout = async () => {
  await logout();
};
</script>
```

### Profile Management

```vue
<script setup lang="ts">
const { profile, loading, updateProfile, checkUsername } = useProfiles();

// Get current profile
console.log(profile.value);

// Update profile
const handleUpdate = async () => {
  await updateProfile(profile.value!.id, {
    full_name: 'John Doe Updated',
    phone: '08199999999',
  });
};

// Check username availability
const isAvailable = await checkUsername('newusername');
</script>
```

### Transactions

```vue
<script setup lang="ts">
const { createTransaction, getTransactions, cancelTransaction } = useTransactions();

// Create deposit
const handleDeposit = async () => {
  await createTransaction({
    transaction_type: 'deposit',
    amount: 100000,
    payment_method: 'e_wallet',
    payment_provider: 'OVO',
    user_account_number: '08123456789',
    user_account_name: 'John Doe',
    notes: 'Deposit via OVO',
  });
};

// Get transactions
const transactions = await getTransactions({
  type: 'deposit',
  status: 'pending',
});

// Cancel transaction
await cancelTransaction('transaction-id');
</script>
```

### Double EXP

```vue
<script setup lang="ts">
const { getCurrentClaim, canClaim, claimDoubleExp } = useDoubleExp();

// Check current active claim
const activeClaim = await getCurrentClaim();

// Check if can claim
const canClaimNow = await canClaim();

// Claim double exp
if (canClaimNow) {
  await claimDoubleExp();
}
</script>
```

---

## 🔐 Security Features

### Row Level Security (RLS)
- ✅ Users can only view/edit their own data
- ✅ Admins have full access to all data
- ✅ Public can read profiles for auth purposes
- ✅ Secure transaction processing

### Triggers
- ✅ Auto-create profile on user signup
- ✅ Auto-generate transaction reference numbers
- ✅ Auto-update balances on transaction completion
- ✅ Auto-update timestamps
- ✅ Auto-deactivate expired claims

---

## 🧪 Testing

After setup, test the following:

1. **Registration**
   - Try registering a new user
   - Check if profile is created automatically
   - Verify email is saved

2. **Login**
   - Try login with email
   - Try login with username
   - Check if last_sign_in_at is updated

3. **Transactions**
   - Create a deposit request
   - Check if reference number is generated
   - Check if status is 'pending'

4. **Double EXP**
   - Claim double EXP
   - Try claiming again (should fail)
   - Wait 24 hours and try again

---

## 🐛 Troubleshooting

### Error: "Database error saving new user"
- Check if trigger `on_auth_user_created` exists
- Run the database setup script again

### Error: "missing FROM-clause entry for table new"
- This error is now fixed in the new setup
- Make sure you ran the complete setup script

### Error: "Row level security policy violation"
- Check if RLS policies are created
- Verify user is authenticated
- Check if user has required permissions

### Transactions not working
- Verify transactions table exists
- Check if all triggers are active
- Ensure RLS policies are correct

---

## 📝 Notes

- **Balance** is stored as TEXT for precision
- **Timestamps** use `TIMESTAMP WITH TIME ZONE`
- **Reference numbers** are auto-generated (format: DEP20250115123045-1234)
- **Double EXP** is valid for 1 hour, can claim every 24 hours

---

## 🎉 You're Done!

Your database and composables are now ready to use. All features should work correctly:
- ✅ User registration and login
- ✅ Profile management
- ✅ Deposit & withdrawal requests
- ✅ Balance tracking
- ✅ Double EXP rewards
- ✅ Admin functions

If you encounter any issues, refer to the troubleshooting section above.

Happy coding! 🚀
