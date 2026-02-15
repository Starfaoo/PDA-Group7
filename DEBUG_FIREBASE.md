# Firebase Debug Checklist

## What to check in the console logs:

### 1. Firebase Initialization

- [ ] See "🔥 Firebase Config loaded:" with hasApiKey, hasProjectId, hasAuthDomain ✅
- [ ] See "✅ Firebase initialized successfully"
- [ ] If NOT, check .env file has EXPO*PUBLIC_FIREBASE*\* variables

### 2. Context Setup

- [ ] See "🔥 [Context] Setting up auth state listener"
- [ ] See "🔥 [Context] Auth object: ✅ Available"
- [ ] If shows ❌ Missing, Firebase failed to initialize
- [ ] See "👤 [Context] Auth state changed: No user" (initial state)

### 3. Login Screen Mounted

- [ ] See "🔐 LoginScreen mounted"
- [ ] See "🔥 Auth object: ✅ Loaded"
- [ ] See "🌐 Google clientId: ✅ Set" (if env var set)

### 4. When you tap Sign In:

- [ ] See "🔐 [Login] handleEmailAuth called, isSignUp: false"
- [ ] See "🔐 [Login] Auth object: ✅ Available"
- [ ] See "📝 [Login] Auth attempt for: [your email] SignUp: false"
- [ ] See "🔑 [Login] Attempting to sign in: [your email]"

#### Success case:

- [ ] See "✅ [Login] Sign in successful: [uid] [email]"
- [ ] See "👤 [Context] Auth state changed: User [uid] ([email])"
- [ ] See "🔄 [Login] Auth check effect triggered user: [email]"
- [ ] See "✅ [Login] User authenticated, redirecting to home"

#### Failure case:

- [ ] See "❌ [Login] Auth Error" with error code and message
- [ ] See Alert popup with error message
- [ ] See "❌ Authentication Failed"

### 5. After failed attempt, if you try again:

- [ ] Loading state should clear (setLoading(false))
- [ ] Button should become clickable again

---

## Common Issues:

**Problem: Auth object is ❌ Missing**

- Solution: Firebase failed to initialize. Check .env file

**Problem: "Network error. Please check your internet connection."**

- Solution: Check internet connection or Firebase project is not accessible

**Problem: "No account found with this email."**

- Solution: Try signing up first, or use existing account

**Problem: Nothing happens when you tap Sign In**

- Solution: Check browser console for ANY errors. Post all logs marked with 🔐 [Login]
