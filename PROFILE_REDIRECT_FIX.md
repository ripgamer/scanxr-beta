# Profile Redirect Fix

## Problem
After uploading a post, users were being redirected to `/profile` instead of their dynamic profile page (e.g., `/{username}`).

## Root Cause
The upload flow was using a hardcoded redirect to `/profile`, which then had to do an additional redirect to the user's actual profile page at `/{username}` or `/{profileSlug}`.

## Solution

### 1. API Enhancement
**File**: `app/api/posts/route.js`

Added `profileSlug` to the API response so the frontend knows exactly where to redirect:

```javascript
return NextResponse.json({
  success: true,
  post: { /* post data */ },
  // Include profile slug for easy redirect
  profileSlug: post.user?.profile?.slug || post.user?.username
});
```

The API already queries the profile slug from the database:
```javascript
include: {
  user: {
    select: {
      username: true,
      email: true,
      profile: {
        select: {
          slug: true  // ← Already fetched
        }
      }
    }
  }
}
```

### 2. Frontend Update
**File**: `app/create/page.jsx`

Updated the redirect logic to use the profileSlug from the API response:

**Before**:
```javascript
setTimeout(() => {
  router.push('/profile');  // ← Double redirect
}, 1000);
```

**After**:
```javascript
setTimeout(() => {
  // Redirect to dynamic profile using the profileSlug from API response
  if (result.profileSlug) {
    router.push(`/${result.profileSlug}`);  // ← Direct to user profile
  } else {
    // Fallback to /profile which will redirect to correct slug
    router.push('/profile');
  }
}, 1000);
```

## How It Works Now

### Upload Flow with Direct Redirect

1. **User uploads post** → Files uploaded to Supabase
2. **API creates post** → Database record created
3. **API returns response** → Includes `profileSlug`
4. **Frontend redirects** → Directly to `/{profileSlug}`

### Example

User: `heyakash`
Profile slug: `heyakash`

**Before**:
```
Upload complete → /profile → /{heyakash}
(Two redirects, slower, URL flicker)
```

**After**:
```
Upload complete → /{heyakash}
(One redirect, faster, clean)
```

## Benefits

✅ **Faster navigation** - One redirect instead of two
✅ **Better UX** - No URL flickering
✅ **More reliable** - Uses actual database slug
✅ **Cleaner code** - Direct path to destination

## Testing

### Test the Fix

1. Go to http://localhost:3002/create
2. Sign in as any user (e.g., `heyakash`)
3. Upload a 3D model with title "Test Direct Redirect"
4. Click publish
5. **Watch the URL bar**:
   - Should go directly to `/{your-username}`
   - Should NOT see `/profile` in the URL bar
   - Should land on your profile with the new post visible

### Expected Behavior

✅ After upload completes (100%)
✅ Brief success message (1 second)
✅ Direct redirect to `/{username}` or `/{profileSlug}`
✅ Profile page loads with new post visible
✅ No intermediate `/profile` URL

### What Changed

| Step | Before | After |
|------|--------|-------|
| Upload complete | Shows success | Shows success |
| Redirect target | `/profile` | `/{profileSlug}` |
| Server redirect | `/profile` → `/{slug}` | Not needed |
| Final URL | `/{slug}` (after 2 redirects) | `/{slug}` (direct) |
| Load time | Slower (2 redirects) | Faster (1 redirect) |

## Fallback Behavior

If for some reason the API doesn't return a `profileSlug`, the code falls back to the old behavior:

```javascript
if (result.profileSlug) {
  router.push(`/${result.profileSlug}`);  // ← Primary path
} else {
  router.push('/profile');  // ← Fallback (will redirect to correct slug)
}
```

This ensures the upload always redirects somewhere, even if there's an unexpected issue.

## Files Changed

✅ `app/api/posts/route.js` - Added `profileSlug` to response
✅ `app/create/page.jsx` - Updated redirect to use `profileSlug`

## Related Files

These files are part of the redirect flow but didn't need changes:

- `app/profile/page.jsx` - Server component that redirects to `/{slug}`
- `app/[slug]/page.jsx` - User profile page (destination)
- `components/gallery-preview.jsx` - Displays posts on profile

## Notes

- The `/profile` page still exists and works as a fallback
- Users can still navigate to `/profile` manually
- `/profile` automatically redirects to `/{username}`
- This fix only affects the post-upload redirect
- Works with both username and custom profile slugs

## Future Improvements

Consider these enhancements:

1. **Redirect to the specific post** instead of profile:
   ```javascript
   router.push(`/p/${result.post.slug}`);
   ```

2. **Show "View Post" and "Back to Profile" buttons**:
   ```javascript
   // Instead of auto-redirect, show options
   <button onClick={() => router.push(`/p/${postSlug}`)}>
     View Post
   </button>
   <button onClick={() => router.push(`/${profileSlug}`)}>
     Back to Profile
   </button>
   ```

3. **Add query parameter to highlight new post**:
   ```javascript
   router.push(`/${profileSlug}?highlight=${postId}`);
   ```
