# Google Analytics 4 Setup Guide

## 🚀 Quick Setup Instructions

### 1. Get Your Google Analytics 4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for `psyched2communicate.com`
3. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Google Analytics ID Configuration

Your Google Analytics 4 Measurement ID (`G-23J0GKYCYG`) is already hardcoded in the application for psyched2communicate.com.

### 3. Deploy to Production

Simply deploy your site to Vercel or your hosting platform - no additional configuration needed!

## 📊 What's Tracked Automatically

### Standard Analytics:
- ✅ Page views
- ✅ User sessions
- ✅ Bounce rate
- ✅ Geographic data
- ✅ Device information
- ✅ Traffic sources

### Custom Events for Your Consultancy:
- 🧑‍⚕️ Consultant contact interactions
- 📚 Resource downloads
- 📅 Event registrations
- 🗺️ Region page views
- 💼 Job application starts
- 📊 Calendar interactions

## 🔒 Privacy Features

- ✅ IP anonymization enabled
- ✅ Google Signals disabled
- ✅ Ad personalization disabled
- ✅ GDPR-friendly configuration
- ✅ No tracking on localhost

## 🛠️ Custom Event Tracking

The analytics system includes helper functions for tracking specific actions:

```typescript
import { 
  trackConsultantContact,
  trackResourceDownload,
  trackEventRegistration,
  trackRegionView,
  trackJobApplicationStart 
} from '@/components/GoogleAnalytics'

// Examples:
trackConsultantContact('Dr. Smith', 'Central Ohio')
trackResourceDownload('IEP Guide', 'PDF')
trackEventRegistration('Spring Training', 'Workshop')
```

## 📈 Viewing Your Data

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Check the "Realtime" report to see live traffic
4. Use "Reports" for detailed insights

## 🍪 Privacy & Consent

Your site now includes a privacy-compliant cookie consent banner that:
- ✅ Appears to new visitors
- ✅ Respects user choice (accept/decline)
- ✅ Stores preferences locally
- ✅ Only loads analytics after consent
- ✅ Links to privacy policy

### Consent Management:
- Users must actively consent before any tracking begins
- Choice is remembered across visits
- Analytics only loads after "Accept Analytics" is clicked
- "Decline Analytics" prevents all tracking

## 🔧 Troubleshooting

### No data showing up?
1. Check that your Measurement ID is correct
2. Verify the environment variable is set
3. Make sure you clicked "Accept Analytics" on the consent banner
4. Test on the live site (not localhost)
5. Wait 24-48 hours for initial data

### Still having issues?
1. Check the browser console for errors
2. Verify the GA4 scripts are loading
3. Use Google Tag Assistant browser extension
4. Check that your site isn't blocking analytics
5. Ensure localStorage has 'analytics-consent' set to 'accepted'

## 🎯 Next Steps

Consider adding:
- Conversion goals (form submissions, downloads)
- Enhanced ecommerce tracking (if applicable)
- Custom dimensions for consultant specializations
- A/B testing with Google Optimize
- Integration with Google Search Console
