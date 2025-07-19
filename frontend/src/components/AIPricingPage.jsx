/**
 * AI Agents SaaS Pricing Page
 * Enterprise AI service monetization with usage-based billing
 * Dark neon theme optimized for AI/tech audiences
 */

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import './AIPricingPage.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const AIPricingPage = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [user, setUser] = useState(null);
    const [usageData, setUsageData] = useState(null);

    // AI Agents subscription plans
    const aiAgentPlans = [
        {
            id: 'starter',
            name: 'AI Starter',
            price: 49,
            currency: 'USD',
            description: 'Perfect for small businesses getting started with AI',
            features: [
                '1,000 AI agent interactions/month',
                'Basic NLP processing',
                'Pre-built agent templates',
                'Email support',
                'Standard response time (< 2s)',
                'Basic analytics dashboard'
            ],
            limits: {
                interactions: '1,000/month',
                agents: '3 agents',
                training: 'Pre-built only'
            },
            highlighted: false,
            ctaText: 'Start AI Journey',
            popular: false
        },
        {
            id: 'professional',
            name: 'AI Professional',
            price: 149,
            currency: 'USD',
            description: 'For growing businesses with advanced AI needs',
            features: [
                '10,000 AI agent interactions/month',
                'Advanced NLP with custom models',
                'Custom agent training',
                'Priority support',
                'Fast response time (< 1s)',
                'Analytics & insights dashboard',
                'API access',
                'Multi-language support',
                'Custom integrations'
            ],
            limits: {
                interactions: '10,000/month',
                agents: '10 agents',
                training: 'Custom training included'
            },
            highlighted: true,
            ctaText: 'Upgrade to Pro',
            popular: true
        },
        {
            id: 'enterprise',
            name: 'AI Enterprise',
            price: 499,
            currency: 'USD',
            description: 'For enterprises requiring unlimited AI power',
            features: [
                'Unlimited AI agent interactions',
                'Custom AI model training',
                'White-label solutions',
                '24/7 dedicated support',
                'Ultra-fast response (< 0.5s)',
                'Advanced analytics & reporting',
                'Custom integrations',
                'Dedicated infrastructure',
                'SLA guarantees',
                'On-premise deployment options'
            ],
            limits: {
                interactions: 'Unlimited',
                agents: 'Unlimited',
                training: 'Full custom training'
            },
            highlighted: false,
            ctaText: 'Contact Enterprise',
            popular: false
        }
    ];

    // Usage-based pricing tiers
    const usagePricing = {
        basic_ai_call: 0.01,
        advanced_ai_call: 0.05,
        custom_training: 2.00,
        data_processing: 0.10
    };

    useEffect(() => {
        setPlans(aiAgentPlans);
        loadUsageData();
        // Load user data from auth system
        // setUser(getCurrentUser());
    }, []);

    const loadUsageData = async () => {
        // Mock usage data - replace with actual API call
        setUsageData({
            current_month: {
                interactions: 2456,
                agents_created: 7,
                training_sessions: 3,
                data_processed_gb: 15.7
            },
            projected_cost: 24.50
        });
    };

    const handleSubscribe = async (planId) => {
        setLoading(true);
        setSelectedPlan(planId);

        try {
            if (!user) {
                window.location.href = '/login?redirect=/pricing';
                return;
            }

            // Create AI customer
            const customerResponse = await fetch('/api/ai/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.authToken}`
                },
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    company: user.company
                })
            });

            const { data: customerData } = await customerResponse.json();

            // Create metered subscription
            const subscriptionResponse = await fetch('/api/ai/subscriptions/metered', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.authToken}`
                },
                body: JSON.stringify({
                    customer_id: customerData.customer_id,
                    plan_id: planId
                })
            });

            const { data: subscriptionData } = await subscriptionResponse.json();

            // Redirect to success page
            window.location.href = '/ai/subscription/success';

        } catch (error) {
            console.error('AI subscription error:', error);
            alert('Failed to create AI subscription. Please try again.');
        } finally {
            setLoading(false);
            setSelectedPlan(null);
        }
    };

    const handleEnterpriseContact = () => {
        window.location.href = 'mailto:tiatheone@protonmail.com?subject=Enterprise%20AI%20Agents%20Inquiry';
    };

    return (
        <div className="ai-pricing-page">
            {/* Hero Section */}
            <div className="ai-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="gradient-text">AI Agent Pricing</span>
                    </h1>
                    <p className="hero-subtitle">
                        Enterprise-grade AI agents that scale with your business. 
                        Pay only for what you use with transparent, predictable pricing.
                    </p>
                    
                    {/* Usage Calculator */}
                    <div className="usage-calculator">
                        <h3>Current Month Usage</h3>
                        <div className="usage-grid">
                            <div className="usage-item">
                                <span className="usage-number">{usageData?.current_month.interactions.toLocaleString()}</span>
                                <span className="usage-label">AI Interactions</span>
                            </div>
                            <div className="usage-item">
                                <span className="usage-number">{usageData?.current_month.agents_created}</span>
                                <span className="usage-label">Active Agents</span>
                            </div>
                            <div className="usage-item">
                                <span className="usage-number">{usageData?.current_month.training_sessions}</span>
                                <span className="usage-label">Training Sessions</span>
                            </div>
                            <div className="usage-item">
                                <span className="usage-number">${usageData?.projected_cost}</span>
                                <span className="usage-label">Projected Overages</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Plans */}
            <div className="ai-pricing-section">
                <div className="pricing-container">
                    <h2 className="section-title">Choose Your AI Plan</h2>
                    <div className="ai-pricing-grid">
                        {plans.map((plan) => (
                            <div 
                                key={plan.id} 
                                className={`ai-pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="popular-badge">
                                        <span>🤖 Most Popular</span>
                                    </div>
                                )}
                                
                                <div className="ai-card-header">
                                    <h3 className="plan-name">{plan.name}</h3>
                                    <div className="price-container">
                                        <span className="currency">{plan.currency}</span>
                                        <span className="price">${plan.price}</span>
                                        <span className="period">/month</span>
                                    </div>
                                    <p className="plan-description">{plan.description}</p>
                                    
                                    {/* Plan limits display */}
                                    <div className="plan-limits">
                                        <div className="limit-item">
                                            <span className="limit-icon">🔢</span>
                                            <span>{plan.limits.interactions}</span>
                                        </div>
                                        <div className="limit-item">
                                            <span className="limit-icon">🤖</span>
                                            <span>{plan.limits.agents}</span>
                                        </div>
                                        <div className="limit-item">
                                            <span className="limit-icon">🧠</span>
                                            <span>{plan.limits.training}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="ai-card-body">
                                    <ul className="ai-features-list">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="ai-feature-item">
                                                <span className="feature-icon">✨</span>
                                                <span className="feature-text">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="ai-card-footer">
                                    <button 
                                        className={`ai-cta-button ${plan.highlighted ? 'primary' : 'secondary'}`}
                                        onClick={() => 
                                            plan.id === 'enterprise' 
                                                ? handleEnterpriseContact() 
                                                : handleSubscribe(plan.id)
                                        }
                                        disabled={loading && selectedPlan === plan.id}
                                    >
                                        {loading && selectedPlan === plan.id ? (
                                            <span className="loading-spinner"></span>
                                        ) : (
                                            plan.ctaText
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Usage-Based Pricing */}
            <div className="usage-pricing-section">
                <div className="usage-container">
                    <h2 className="section-title">
                        <span className="gradient-text">Usage-Based Pricing</span>
                    </h2>
                    <p className="usage-subtitle">
                        Transparent pricing for AI services beyond your plan limits
                    </p>
                    
                    <div className="usage-pricing-grid">
                        <div className="usage-pricing-card">
                            <div className="usage-icon">🤖</div>
                            <h3>Basic AI Interactions</h3>
                            <div className="usage-price">${usagePricing.basic_ai_call.toFixed(2)}</div>
                            <p>Per basic AI agent interaction beyond plan limits</p>
                        </div>
                        
                        <div className="usage-pricing-card">
                            <div className="usage-icon">🧠</div>
                            <h3>Advanced AI Processing</h3>
                            <div className="usage-price">${usagePricing.advanced_ai_call.toFixed(2)}</div>
                            <p>Per advanced AI interaction with custom models</p>
                        </div>
                        
                        <div className="usage-pricing-card">
                            <div className="usage-icon">🎯</div>
                            <h3>Custom Model Training</h3>
                            <div className="usage-price">${usagePricing.custom_training.toFixed(2)}</div>
                            <p>Per custom AI model training session</p>
                        </div>
                        
                        <div className="usage-pricing-card">
                            <div className="usage-icon">📊</div>
                            <h3>Data Processing</h3>
                            <div className="usage-price">${usagePricing.data_processing.toFixed(2)}</div>
                            <p>Per GB of data processed for training</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Features Showcase */}
            <div className="ai-features-section">
                <div className="features-container">
                    <h2 className="section-title">Why Choose Tiation AI Agents?</h2>
                    <div className="ai-features-grid">
                        <div className="ai-feature-card">
                            <div className="feature-icon">🚀</div>
                            <h3>Lightning Fast</h3>
                            <p>Sub-second response times with optimized AI models for real-time interactions</p>
                        </div>
                        
                        <div className="ai-feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>Custom Training</h3>
                            <p>Train AI agents on your specific data for highly personalized interactions</p>
                        </div>
                        
                        <div className="ai-feature-card">
                            <div className="feature-icon">🌐</div>
                            <h3>Multi-Language</h3>
                            <p>Support for 50+ languages with native-level understanding and responses</p>
                        </div>
                        
                        <div className="ai-feature-card">
                            <div className="feature-icon">🔗</div>
                            <h3>Easy Integration</h3>
                            <p>RESTful APIs and SDKs for seamless integration with your existing systems</p>
                        </div>
                        
                        <div className="ai-feature-card">
                            <div className="feature-icon">📈</div>
                            <h3>Advanced Analytics</h3>
                            <p>Detailed insights into AI performance, user interactions, and optimization opportunities</p>
                        </div>
                        
                        <div className="ai-feature-card">
                            <div className="feature-icon">🛡️</div>
                            <h3>Enterprise Security</h3>
                            <p>SOC2 compliant with end-to-end encryption and advanced data protection</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="ai-faq-section">
                <div className="faq-container">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <div className="ai-faq-grid">
                        <div className="faq-item">
                            <h4>How does usage-based billing work?</h4>
                            <p>You pay your base subscription fee plus any overages beyond your plan limits. We track every AI interaction and bill transparently at the end of each month.</p>
                        </div>
                        
                        <div className="faq-item">
                            <h4>Can I train custom AI models?</h4>
                            <p>Yes! Professional and Enterprise plans include custom model training. You can train AI agents on your specific data and use cases.</p>
                        </div>
                        
                        <div className="faq-item">
                            <h4>What's the difference between basic and advanced AI calls?</h4>
                            <p>Basic calls use pre-trained models for standard interactions. Advanced calls involve custom models, complex reasoning, or specialized processing.</p>
                        </div>
                        
                        <div className="faq-item">
                            <h4>Do you offer enterprise deployment?</h4>
                            <p>Absolutely! Enterprise plans include on-premise deployment options, dedicated infrastructure, and custom SLA agreements.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="ai-cta-section">
                <div className="cta-container">
                    <h2 className="cta-title">Ready to Revolutionize Your Business with AI?</h2>
                    <p className="cta-subtitle">
                        Join thousands of businesses already using Tiation AI Agents
                    </p>
                    <div className="ai-cta-buttons">
                        <button 
                            className="ai-cta-button primary large"
                            onClick={() => handleSubscribe('professional')}
                        >
                            🚀 Start Free Trial
                        </button>
                        <button 
                            className="ai-cta-button secondary large"
                            onClick={handleEnterpriseContact}
                        >
                            💬 Talk to AI Expert
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIPricingPage;
