# Supabase + Stripe Integration Plan
## SavvyPro JOT Web Application

---

## 📋 **Current State Analysis**

### **Existing Infrastructure (Confirmed):**
- ✅ **Supabase Authentication**: User signup/login system in place
- ✅ **Subscription Tiers**: 4 tiers defined (Free, Basic, Professional, Executive)
- ✅ **Feature Flags**: Comprehensive tier-based feature control
- ✅ **Database Schema**: `subscriptions` table exists with basic structure
- ✅ **Premium Features**: Extensive mindfulness and job tracking features
- ✅ **Marketing Site**: Separate Stripe integration already exists

### **Current Subscription Tiers:**

| Tier | Price | Features | Limits |
| --- | --- | --- | --- |
| **Free** | $0 | Basic job tracking, daily check-in | 10 jobs, 5 extension uses |
| **Basic** | TBD | + Gratitude journal, rejection reframe | 50 jobs, 20 extension uses |
| **Professional** | TBD | + Goal setting, analytics, CSV export | 100 jobs, 150 extension uses |
| **Executive** | TBD | + Unlimited jobs, appointment scheduling | Unlimited jobs, 400 extension uses |

---

## 🎯 **Implementation Strategy**

### **Phase 1: Stripe Setup & Configuration (Week 1)**

#### **1.1 Stripe Account Setup**

- **Stripe Dashboard Configuration**
    - Set up products for each subscription tier
    - Configure pricing (monthly/annual options)
    - Set up webhooks for payment events
    - Configure tax settings (if applicable)

#### **1.2 Environment Configuration**

```bash
# Add to .env.local
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PROFESSIONAL=price_...
STRIPE_PRICE_EXECUTIVE=price_...
```

#### **1.3 Stripe Products & Pricing Structure**

```jsx
// Monthly-only pricing structure
const STRIPE_PRODUCTS = {
  basic: {
    monthly: '$9.99/month',
    features: ['50 jobs', 'Gratitude journal', 'Rejection reframe', '20 extension uses']
  },
  professional: {
    monthly: '$19.99/month',
    features: ['100 jobs', 'All Basic features', 'Goal setting', 'Analytics', '150 extension uses']
  },
  executive: {
    monthly: '$29.99/month',
    features: ['Unlimited jobs', 'All features', 'Appointment scheduling', '400 extension uses']
  }
};
```

---

## 🔧 **Technical Implementation Plan**

### **Phase 2: Backend Integration (Week 2)**

#### **2.1 Stripe Service Layer**

**File**: `src/services/stripeService.ts`

```tsx
// Core Stripe operations
- createCheckoutSession()
- createCustomerPortalSession()
- handleWebhookEvents()
- getSubscriptionStatus()
- cancelSubscription()
- updateSubscription()
```

#### **2.2 Database Schema Updates**

**File**: `supabase/migrations/xxxx-stripe-integration.sql`

```sql
-- Add Stripe-specific columns to subscriptions table
ALTER TABLE subscriptions ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE subscriptions ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE subscriptions ADD COLUMN stripe_price_id TEXT;
ALTER TABLE subscriptions ADD COLUMN current_period_start TIMESTAMP;
ALTER TABLE subscriptions ADD COLUMN current_period_end TIMESTAMP;
ALTER TABLE subscriptions ADD COLUMN trial_end TIMESTAMP;

-- Add marketing information table
CREATE TABLE user_marketing_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  lead_source TEXT, -- 'organic', 'social', 'referral', 'paid_ads'
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  landing_page TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **2.3 Webhook Handler**

**File**: `supabase/functions/stripe-webhook/index.ts`

```tsx
// Handle Stripe webhook events
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
```

---

### **Phase 3: Frontend Integration (Week 3)**

#### **3.1 Login Page Redesign**

**File**: `src/auth/Login.tsx`

```tsx
// New login flow:
1. Email/password input
2. "Sign In" button → Direct login
3. "Get Started" button → Redirect to Stripe checkout
4. Marketing data capture (UTM parameters, referrer)
```

#### **3.2 Stripe Checkout Integration**

**File**: `src/components/stripe/StripeCheckout.tsx`

```tsx
// Features:
- Tier selection with feature comparison
- Monthly pricing display
- Marketing data collection
- Stripe Checkout session creation
- Success/cancel handling
```

#### **3.3 Customer Portal Integration**

**File**: `src/components/stripe/CustomerPortal.tsx`

```tsx
// Features:
- Subscription management
- Billing history
- Payment method updates
- Plan changes
- Cancellation handling
```

---

### **Phase 4: Marketing Data Capture (Week 4)**

#### **4.1 Marketing Data Collection**

**File**: `src/services/marketingService.ts`

```tsx
// Capture marketing data:
- UTM parameters (source, medium, campaign)
- Referrer information
- Landing page
- User journey tracking
- Lead scoring
```

#### **4.2 Analytics Integration**

**File**: `src/services/analyticsService.ts`

```tsx
// Track key metrics:
- Conversion rates by source
- Customer lifetime value
- Churn analysis
- Feature adoption rates
- Revenue attribution
```

---

## 💰 **Pricing Strategy Recommendations**

### **Monthly-Only Pricing Structure:**

| Tier | Monthly | Target Market |
| --- | --- | --- |
| **Basic** | $9.99 | Job seekers, students |
| **Professional** | $19.99 | Career changers, professionals |
| **Executive** | $29.99 | Senior professionals, executives |

### **Pricing Psychology:**

- **Free tier** as lead magnet
- **Basic tier** for price-sensitive users
- **Professional tier** as primary target
- **Executive tier** for high-value customers

---

## 🎯 **Marketing Integration Strategy**

### **Lead Capture Optimization:**

1. **Landing Page Optimization**
    - A/B test different value propositions
    - Feature comparison tables
    - Social proof and testimonials
    - Free trial offers
2. **Marketing Data Collection**
    - UTM parameter tracking
    - Referrer analysis
    - User journey mapping
    - Lead scoring algorithms
3. **Conversion Funnel**
    - Free tier → Basic tier (20% conversion target)
    - Basic tier → Professional tier (15% conversion target)
    - Professional tier → Executive tier (10% conversion target)

---

## 🔄 **User Flow Redesign**

### **New User Journey:**

```
1. User visits site → Marketing data captured
2. "Get Started" button → Stripe checkout
3. Tier selection → Payment processing
4. Account creation → Supabase user + Stripe customer
5. Welcome email → Feature onboarding
6. Usage tracking → Upgrade prompts
```

### **Existing User Journey:**

```
1. User logs in → Direct access to features
2. Upgrade prompts → Stripe checkout
3. Subscription management → Customer portal
4. Feature usage → Tier-based access control
```

---

## 📊 **Required Stripe Configuration**

### **Stripe Dashboard Setup:**

1. **Products & Prices**
    - Create products for each tier
    - Set up monthly pricing only
    - Configure trial periods (if desired)
2. **Webhooks**
    - Configure webhook endpoints
    - Set up event filtering
    - Test webhook delivery
3. **Customer Portal**
    - Enable customer portal
    - Configure allowed features
    - Set up business information
4. **Tax Configuration**
    - Set up tax rates (if applicable)
    - Configure tax behavior
    - Test tax calculations

---

## 🛠️ **Implementation Checklist**

### **Week 1: Stripe Setup**

- [ ]  Stripe account configuration
- [ ]  Products and pricing setup
- [ ]  Webhook configuration
- [ ]  Environment variables setup

### **Week 2: Backend Integration**

- [ ]  Stripe service layer implementation
- [ ]  Database schema updates
- [ ]  Webhook handler development
- [ ]  Testing and validation

### **Week 3: Frontend Integration**

- [ ]  Login page redesign
- [ ]  Stripe checkout integration
- [ ]  Customer portal integration
- [ ]  Error handling and edge cases

### **Week 4: Marketing & Analytics**

- [ ]  Marketing data capture
- [ ]  Analytics integration
- [ ]  A/B testing setup
- [ ]  Performance optimization

---

## 🚨 **Critical Considerations**

### **Security & Compliance:**

- **PCI Compliance**: Use Stripe Elements for secure payment processing
- **Data Privacy**: Implement proper data handling for marketing information
- **GDPR Compliance**: Add privacy controls and data export features

### **Error Handling:**

- **Payment Failures**: Graceful handling of failed payments
- **Webhook Failures**: Retry mechanisms and error logging
- **Network Issues**: Offline capability and sync when online

### **Testing Strategy:**

- **Stripe Test Mode**: Comprehensive testing with test cards
- **Webhook Testing**: Use Stripe CLI for local webhook testing
- **User Journey Testing**: End-to-end testing of subscription flows

---

## 📈 **Success Metrics**

### **Key Performance Indicators:**

- **Conversion Rate**: Free → Paid (target: 15-20%)
- **Customer Acquisition Cost**: Track by marketing channel
- **Customer Lifetime Value**: Monitor by subscription tier
- **Churn Rate**: Monthly and annual churn tracking
- **Feature Adoption**: Usage rates by subscription tier

### **Revenue Targets (Based on Corrected Pricing):**

- **Month 1**: $2,000 MRR (targeting 200 paid customers)
- **Month 3**: $6,000 MRR (targeting 300 paid customers)
- **Month 6**: $12,000 MRR (targeting 600 paid customers)
- **Month 12**: $24,000 MRR (targeting 1,200 paid customers)

---

## 🎯 **Next Steps**

1. **Review and approve** this implementation plan
2. **Set up Stripe account** and configure products/pricing
3. **Begin Phase 1** implementation (Stripe setup)
4. **Schedule weekly check-ins** for progress tracking
5. **Prepare marketing materials** for launch

This comprehensive plan will transform your current free signup system into a full-featured subscription platform with Stripe integration, marketing data capture, and optimized conversion funnels. The phased approach ensures minimal disruption to existing users while maximizing revenue potential.
