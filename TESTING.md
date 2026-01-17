# 🧪 Satya Guard - Complete Testing Checklist

## ✅ **Pre-Deployment Testing (Before Going Live)**

### 1. **Authentication Flow Testing**

#### User Registration
- [ ] Navigate to http://localhost:3000
- [ ] Click "Register"
- [ ] Enter full name: "John Interviewer"
- [ ] Enter email: "john@test.com"
- [ ] Enter password: "Test@123"
- [ ] Select role: INTERVIEWER
- [ ] Click "Register"
- [ ] **Expected:** Auto-login, redirect to Interviewer Dashboard
- [ ] **Verify:** Profile dropdown shows name and "INTERVIEWER" role

#### User Login
- [ ] Click "Sign Out"
- [ ] Click "Login"
- [ ] Enter same credentials
- [ ] Click "Login"
- [ ] **Expected:** Redirect to Interviewer Dashboard
- [ ] **Verify:** Previous sessions visible

#### Logout
- [ ] Click profile icon (top right)
- [ ] Verify dropdown shows email and name
- [ ] Click "Sign Out"
- [ ] **Expected:** Redirect to login page
- [ ] **Verify:** Cannot access /dashboard without login

---

### 2. **Interviewer Dashboard Testing**

#### Session Creation
- [ ] Login as INTERVIEWER
- [ ] Verify stats cards show counts
- [ ] Click "Create New Session"
- [ ] Modal opens
- [ ] Enter candidate ID: "CAND-001"
- [ ] Click "Create Session"
- [ ] **Expected:** Join code displayed (6 characters)
- [ ] Click "Copy Code"
- [ ] **Verify:** Alert shows "copied to clipboard"
- [ ] Click "Done"
- [ ] **Expected:** Session appears in list immediately
- [ ] **Verify:** Session shows:
  - Candidate ID: CAND-001
  - Join Code: [6 chars]
  - Status: PENDING
  - Created date

#### Stats Update
- [ ] Note "Total Sessions" count before
- [ ] Create another session
- [ ] **Expected:** Count increases by 1
- [ ] **Verify:** Stats cards update correctly

#### Session List Display
- [ ] Verify all created sessions visible
- [ ] Hover over session card
- [ ] **Expected:** Border color changes to purple
- [ ] **Verify:** Card slides right slightly

---

### 3. **Interviewee Dashboard Testing**

#### Registration & Join
- [ ] Open incognito window → http://localhost:3000
- [ ] Register as INTERVIEWEE
- [ ] Full name: "Jane Candidate"
- [ ] Email: "jane@test.com"
- [ ] Password: "Test@123"
- [ ] Role: INTERVIEWEE
- [ ] **Expected:** Redirect to Interviewee Dashboard
- [ ] **Verify:** Different UI than interviewer

#### Joining Session
- [ ] Click "Join Interview Session"
- [ ] Modal opens
- [ ] Enter join code from previous test (e.g., "ABC123")
- [ ] As you type, verify it converts to uppercase
- [ ] Click "Join Session"
- [ ] **Expected:** Green success message appears
- [ ] **Expected:** Modal auto-closes after 1.5 seconds
- [ ] **Expected:** Session appears in "My Interview Reports"
- [ ] **Verify:** Session shows:
  - Session ID
  - Date
  - Status: PENDING

#### Invalid Code Test
- [ ] Click "Join Interview Session"
- [ ] Enter invalid code: "XXXXXX"
- [ ] Click "Join Session"
- [ ] **Expected:** Red error message appears
- [ ] **Verify:** Modal stays open
- [ ] **Verify:** Can try again

#### Stats Update
- [ ] Verify "My Sessions" count = 1
- [ ] Join another session (create new one first)
- [ ] **Expected:** Count increases
- [ ] **Verify:** Only joined sessions visible

---

### 4. **Session Privacy Testing**

#### Interviewer Privacy
- [ ] As interviewer, create 3 sessions
- [ ] **Expected:** See all 3 sessions
- [ ] Login as different interviewer
- [ ] **Expected:** See 0 sessions (or only their own)
- [ ] **Verify:** No cross-contamination

#### Interviewee Privacy
- [ ] As interviewee, join 2 sessions
- [ ] **Expected:** See only those 2 sessions
- [ ] Login as different interviewee
- [ ] **Expected:** See 0 sessions
- [ ] **Verify:** Cannot see other's sessions

---

### 5. **Video Upload Testing** (Optional - requires video file)

#### Upload Flow
- [ ] Login as INTERVIEWER
- [ ] Navigate to "Upload Video" (if in nav)
- [ ] Select a video file (MP4, under 100MB)
- [ ] Enter candidate ID
- [ ] Click "Upload"
- [ ] **Expected:** Upload starts
- [ ] **Expected:** Video uploads to Cloudinary
- [ ] Wait for analysis to complete
- [ ] **Expected:** Session status changes to COMPLETED
- [ ] **Verify:** Report generated

#### Cloudinary Verification
- [ ] Login to Cloudinary dashboard
- [ ] Navigate to Media Library
- [ ] **Verify:** Video appears in `satya-guard/videos/` folder
- [ ] **Verify:** PDF appears in `satya-guard/reports/` folder
- [ ] **Verify:** URLs are accessible

---

### 6. **API Testing**

#### Backend Health Check
- [ ] Open: http://localhost:8000/docs
- [ ] **Expected:** FastAPI Swagger UI loads
- [ ] **Verify:** All endpoints listed:
  - POST /api/auth/sync
  - GET /api/auth/me
  - POST /api/sessions/create
  - POST /api/sessions/join
  - GET /api/sessions
  - GET /api/sessions/my-reports
  - POST /api/upload
  - GET /api/reports/{id}/json
  - GET /api/reports/{id}/pdf

#### Token Verification
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Make any API request (e.g., load dashboard)
- [ ] Click on request
- [ ] Check Headers → Authorization
- [ ] **Verify:** Bearer token present
- [ ] **Verify:** Format: "Bearer eyJ..."

---

### 7. **Error Handling Testing**

#### Network Error
- [ ] Stop backend server
- [ ] Try to create session
- [ ] **Expected:** Error message displayed
- [ ] **Verify:** UI doesn't crash

#### Invalid Token
- [ ] Clear localStorage
- [ ] Try to access dashboard
- [ ] **Expected:** Redirect to login
- [ ] **Verify:** Protected routes work

#### Duplicate Join Code
- [ ] Try joining same session twice
- [ ] **Expected:** Error message shown
- [ ] **Verify:** Graceful handling

---

### 8. **UI/UX Testing**

#### Responsive Design
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test on mobile (375px width)
- [ ] **Verify:** UI adapts correctly
- [ ] Test on tablet (768px)
- [ ] **Verify:** Layout adjusts
- [ ] Test on desktop (1920px)
- [ ] **Verify:** Content centered

#### Loading States
- [ ] Watch for loading indicators
- [ ] **Verify:** Spinners show during:
  - Login
  - Registration
  - Session creation
  - Session joining
  - Data fetching

#### Animations
- [ ] Hover over buttons
- [ ] **Verify:** Transform on hover
- [ ] Hover over session cards
- [ ] **Verify:** Border color changes
- [ ] **Verify:** Smooth transitions (not jarring)

---

### 9. **Performance Testing**

#### Load Time
- [ ] Clear cache
- [ ] Reload page
- [ ] Check Network tab → Timing
- [ ] **Expected:** Page load < 2 seconds
- [ ] **Verify:** No slow requests (>5s)

#### Many Sessions
- [ ] Create 20+ sessions
- [ ] **Verify:** List scrolls smoothly
- [ ] **Verify:** No lag when scrolling
- [ ] **Verify:** Stats calculate quickly

---

### 10. **Security Testing**

#### Authorization
- [ ] As INTERVIEWEE, try to access create session
- [ ] Use browser console: `fetch('/api/sessions/create', {method: 'POST'})`
- [ ] **Expected:** 401/403 error
- [ ] **Verify:** Role protection works

#### SQL Injection
- [ ] Try entering: `'; DROP TABLE users; --`
- [ ] In candidate ID field
- [ ] **Expected:** Treated as literal string
- [ ] **Verify:** No database corruption

#### XSS Protection
- [ ] Enter: `<script>alert('XSS')</script>`
- [ ] In any input field
- [ ] **Expected:** Displays as text, not executed
- [ ] **Verify:** No alert popup

---

### 11. **Database Testing**

#### Data Persistence
- [ ] Create session
- [ ] Stop and restart backend
- [ ] **Expected:** Session still exists
- [ ] **Verify:** Database persists correctly

#### Foreign Keys
- [ ] Check session has interviewer_id
- [ ] Join as interviewee
- [ ] **Verify:** interviewee_id populated
- [ ] **Verify:** Relationships maintained

---

### 12. **Firebase Integration Testing**

#### Authentication Service
- [ ] Login to Firebase Console
- [ ] Navigate to Authentication
- [ ] **Verify:** Registered users appear
- [ ] **Verify:** UIDs match database
- [ ] **Verify:** Email/password enabled

#### Token Refresh
- [ ] Stay logged in for 1 hour
- [ ] Make API request
- [ ] **Expected:** Still works (token auto-refreshes)
- [ ] **Verify:** No 401 errors

---

### 13. **Cloudinary Integration Testing**

#### Storage Verification
- [ ] Upload video
- [ ] Login to Cloudinary
- [ ] Check storage usage
- [ ] **Verify:** Video stored in correct folder
- [ ] **Verify:** Public ID matches session ID

#### URL Access
- [ ] Copy video URL from database
- [ ] Open in new tab
- [ ] **Expected:** Video plays
- [ ] **Verify:** CDN serving correctly

---

## 📊 **Test Results Template**

```
Date: __________
Tester: __________

Total Tests: ___
Passed: ___
Failed: ___
Pass Rate: ___%

Critical Issues:
[ ] None
[ ] List issues:
    - 
    - 

Minor Issues:
[ ] None
[ ] List issues:
    - 
    - 

Notes:
_________________________________
_________________________________
_________________________________
```

---

## ✅ **Sign-Off Checklist**

Before deploying to production:

- [ ] All authentication tests passed
- [ ] Role-based access working correctly
- [ ] Session creation/joining working
- [ ] Video upload to Cloudinary successful
- [ ] Reports generated correctly
- [ ] No security vulnerabilities found
- [ ] Performance acceptable (<3s load)
- [ ] UI responsive on all devices
- [ ] Error handling graceful
- [ ] Database persistence verified
- [ ] Firebase integration working
- [ ] Cloudinary integration working
- [ ] All critical paths tested
- [ ] No console errors
- [ ] Documentation complete

**Tested By:** _______________  
**Date:** _______________  
**Approved for Deployment:** [ ] Yes [ ] No

---

## 🚀 **Ready for Production?**

If all checkboxes above are checked, your application is **READY FOR DEPLOYMENT**! 🎉

Follow the **DEPLOYMENT.md** guide to go live.

---

**Happy Testing!** 🧪
