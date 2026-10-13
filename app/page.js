'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, ArrowRightLeft, ArrowUpRight, Ban, BarChart3,
  Bell, BriefcaseBusiness, Building2, CalendarDays, Check, CheckCircle2,
  ChevronDown, ChevronRight, CircleDollarSign, CircleUserRound, ClipboardCheck,
  ClipboardList, Clock3, Columns, Columns3, Copy, Database, Download, ExternalLink, Eye, EyeOff,
  FileCheck2, FileText, FileSpreadsheet, FileImage, Filter, GripVertical,
  Handshake, Inbox, Kanban, LayoutDashboard, LayoutGrid, Link2, List, ListChecks, LockKeyhole, Mail,
  Menu, MessageSquareText, MoreHorizontal, Paperclip, Plus, RefreshCw, RotateCcw, Search, SearchCheck, Send,
  Settings, ShieldCheck, SlidersHorizontal, Sparkles, TrendingUp, UserPlus,
  UsersRound, X
} from 'lucide-react';

function parseRevenueValue(str) {
  if (!str) return 0;
  const num = parseFloat(String(str).replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
}

function sumVolume(items, key = 'revenue') {
  const total = (items || []).reduce((sum, item) => sum + parseRevenueValue(item?.[key]), 0);
  return total > 0 ? `$${total.toFixed(0)}M` : '—';
}


/* ==========================================================================
   SEED DATA & INITIAL STATES
   ========================================================================== */

const defaultSellerCustomFields = [
  { id: 'scf_ebitda', label: 'EBITDA Margin', section: 'Financials & Performance', type: 'text', placeholder: 'e.g. 24%' },
  { id: 'scf_counsel', label: 'Company Legal Counsel', section: 'Governance, Legal & Ownership', type: 'text', placeholder: 'e.g. Cooley LLP' },
  { id: 'scf_tech', label: 'Core Cloud / Tech Stack', section: 'Technology & Operations', type: 'text', placeholder: 'e.g. AWS, React, Python' }
];

const defaultInvestorCustomFields = [
  { id: 'icf_target_ebitda', label: 'Target Portfolio EBITDA', section: 'Mandate & Capital Strategy', type: 'text', placeholder: 'e.g. $5M–$15M' },
  { id: 'icf_lead_partner', label: 'Primary Deal Partner', section: 'Firm Overview & Criteria', type: 'text', placeholder: 'e.g. Sarah Jenkins' },
  { id: 'icf_co_invest', label: 'Co-Investment Rights', section: 'Mandate & Capital Strategy', type: 'text', placeholder: 'e.g. Yes (up to 25%)' }
];

const sellerSections = [
  'Company Details & Overview',
  'Financials & Performance',
  'Governance, Legal & Ownership',
  'Technology & Operations'
];

const investorSections = [
  'Firm Overview & Criteria',
  'Mandate & Capital Strategy',
  'Sector & Portfolio Preferences',
  'Relationship & Team Notes'
];

const seedSellers = [
  {
    id: 's1', name: 'Northstar Care', initials: 'NC', sector: 'Healthcare IT',
    revenue: '$26M', stage: 'Qualified', fit: 88, source: 'Founder referral',
    updated: 'Today, 9:24 AM', next: 'Review financial package', location: 'Austin, TX',
    goal: 'Explore a majority sale', growth: '32%', margin: '18%', retention: '112%',
    timing: '3–6 months', owner: 'Maya Chen', color: 'mint', prep: 68,
    contactEmail: 'founders@northstarcare.com',
    summary: 'Patient access and revenue-cycle software for specialty clinics.',
    tags: ['Recurring revenue', 'Founder-led', 'US'],
    customFieldValues: { scf_ebitda: '22%', scf_counsel: 'Wilson Sonsini', scf_tech: 'AWS Cloud, React, Node' }
  },
  {
    id: 's2', name: 'CedarPay', initials: 'CP', sector: 'Financial Technology',
    revenue: '$41M', stage: 'Preparing', fit: 81, source: 'Past relationship',
    updated: 'Yesterday', next: 'Complete customer concentration', location: 'Chicago, IL',
    goal: 'Evaluate sale vs. growth capital', growth: '24%', margin: '21%', retention: '118%',
    timing: '6–9 months', owner: 'Jordan Lee', color: 'lavender', prep: 76,
    contactEmail: 'leadership@cedarpay.io',
    summary: 'Payments infrastructure for vertical SaaS providers.',
    tags: ['Payments', 'B2B SaaS', 'US'],
    customFieldValues: { scf_ebitda: '25%', scf_counsel: 'Latham & Watkins', scf_tech: 'Stripe API, GCP, Next.js' }
  },
  {
    id: 's3', name: 'BrightPath Learning', initials: 'BL', sector: 'Education Technology',
    revenue: '$19M', stage: 'Nurture', fit: 72, source: 'Website inquiry',
    updated: 'Oct 9', next: 'Check in after board meeting', location: 'Boston, MA',
    goal: 'Prepare for a 2027 fundraise', growth: '38%', margin: '12%', retention: '106%',
    timing: '9–12 months', owner: 'Maya Chen', color: 'peach', prep: 31,
    contactEmail: 'exec@brightpathlearning.com',
    summary: 'Workforce learning platform for regulated industries.',
    tags: ['Workforce learning', 'Founder-led', 'US'],
    customFieldValues: { scf_ebitda: '14%', scf_counsel: 'Goodwin Procter', scf_tech: 'Azure, Django' }
  },
  {
    id: 's4', name: 'Atlas Market Data', initials: 'AM', sector: 'Data & Analytics',
    revenue: '$34M', stage: 'In Market', fit: 91, source: 'Investor introduction',
    updated: 'Oct 10', next: 'Round-one indications due', location: 'New York, NY',
    goal: 'Sell to a strategic buyer', growth: '29%', margin: '26%', retention: '121%',
    timing: 'Active', owner: 'Jordan Lee', color: 'blue', prep: 100,
    contactEmail: 'dealteam@atlasdata.co',
    summary: 'Market data and workflow tools for institutional investors.',
    tags: ['Data infrastructure', 'Recurring revenue', 'US'],
    customFieldValues: { scf_ebitda: '30%', scf_counsel: 'Kirkland & Ellis', scf_tech: 'Snowflake, Rust, AWS' }
  },
  {
    id: 's5', name: 'Fieldnote Commerce', initials: 'FC', sector: 'Commerce Technology',
    revenue: '$14M', stage: 'New', fit: 63, source: 'Conference meeting',
    updated: 'Oct 11', next: 'Schedule first conversation', location: 'Denver, CO',
    goal: 'Considering strategic options', growth: '41%', margin: '9%', retention: '103%',
    timing: 'Unknown', owner: 'Unassigned', color: 'gold', prep: 12,
    contactEmail: 'founders@fieldnote.shop',
    summary: 'Order and inventory software for specialty retailers.',
    tags: ['Commerce', 'SMB software', 'US'],
    customFieldValues: { scf_ebitda: '11%', scf_counsel: 'Local Denver Counsel', scf_tech: 'Shopify Plus, Ruby' }
  }
];

const seedInvestors = [
  {
    id:'i1', name:'Cobalt Growth Partners', initials:'CG', type:'Growth Equity',
    sectors:['Healthcare IT','Education Technology'], stages:['Series B','Growth'],
    check:'$15M–$40M', geography:'North America', status:'Active', lastTouch:'2 days ago',
    color:'navy', contactEmail:'partners@cobaltgp.com',
    description:'Growth partner for recurring-revenue software businesses.',
    customFieldValues: { icf_target_ebitda: '$4M–$12M', icf_lead_partner: 'David Miller', icf_co_invest: 'Yes (up to 20%)' }
  },
  {
    id:'i2', name:'Harborline Capital', initials:'HC', type:'Private Equity',
    sectors:['Financial Technology','Data & Analytics'], stages:['Growth','Buyout'],
    check:'$25M–$100M', geography:'US / Canada', status:'Active', lastTouch:'Today',
    color:'mint', contactEmail:'deals@harborlinecap.com',
    description:'Control and minority investments in software and data.',
    customFieldValues: { icf_target_ebitda: '$6M–$20M', icf_lead_partner: 'Elena Vance', icf_co_invest: 'Required' }
  },
  {
    id:'i3', name:'Foundry Ventures', initials:'FV', type:'Crossover Investor',
    sectors:['Healthcare IT','Commerce Technology'], stages:['Series B','Series C'],
    check:'$10M–$30M', geography:'North America', status:'Warm', lastTouch:'1 week ago',
    color:'lavender', contactEmail: 'investments@foundryv.com',
    description:'Late-stage investor with a focus on category leaders.',
    customFieldValues: { icf_target_ebitda: 'Breakeven to $5M', icf_lead_partner: 'Marcus Lin', icf_co_invest: 'Optional' }
  },
  {
    id:'i4', name:'Meridian Strategic Group', initials:'MS', type:'Strategic Investor',
    sectors:['Financial Technology','Commerce Technology'], stages:['Growth','Strategic'],
    check:'$5M–$25M', geography:'Global', status:'Warm', lastTouch:'3 weeks ago',
    color:'peach', contactEmail: 'corpdev@meridianstrat.com',
    description:'Technology operator and investor seeking strategic partnerships.',
    customFieldValues: { icf_target_ebitda: '$3M+', icf_lead_partner: 'Rachel Adams', icf_co_invest: 'Yes' }
  },
  {
    id:'i5', name:'Summit Ridge Credit', initials:'SR', type:'Credit Provider',
    sectors:['Healthcare IT','Data & Analytics'], stages:['Growth','Credit'],
    check:'$10M–$60M', geography:'US', status:'Active', lastTouch:'5 days ago',
    color:'blue', contactEmail: 'originations@summitridgecredit.com',
    description:'Flexible credit for predictable recurring revenue.',
    customFieldValues: { icf_target_ebitda: '$2M+ Recurring', icf_lead_partner: 'Thomas Cole', icf_co_invest: 'Senior Secured' }
  },
  {
    id:'i6', name:'Oak & Union Partners', initials:'OU', type:'Private Equity',
    sectors:['Education Technology','Healthcare IT'], stages:['Buyout','Growth'],
    check:'$20M–$75M', geography:'North America', status:'Nurture', lastTouch:'1 month ago',
    color:'gold', contactEmail: 'info@oakunionpe.com',
    description:'Buy-and-build investor in essential services software.',
    customFieldValues: { icf_target_ebitda: '$5M–$15M', icf_lead_partner: 'Katherine Shaw', icf_co_invest: 'Yes' }
  }
];

const seedTasks = [
  { id:'t1', title:'Review Northstar Care financial package', company:'Northstar Care', due:'Today', owner:'Maya Chen', kind:'Seller prep', done:false },
  { id:'t2', title:'Confirm blind teaser approval', company:'Atlas Market Data', due:'Today', owner:'Jordan Lee', kind:'Confidentiality', done:false },
  { id:'t3', title:'Send follow-up to BrightPath founder', company:'BrightPath Learning', due:'Tomorrow', owner:'Maya Chen', kind:'Nurture', done:false },
  { id:'t4', title:'Collect round-one terms', company:'Atlas Market Data', due:'Oct 16', owner:'Jordan Lee', kind:'Investor process', done:false },
  { id:'t5', title:'Update investor profile', company:'Cobalt Growth Partners', due:'Oct 17', owner:'Operations', kind:'Data quality', done:true }
];

const seedLeads = [
  {
    id: 'ld1',
    company: 'Vanguard Diagnostics',
    name: 'Dr. Keith Vance',
    email: 'k.vance@vanguard-dx.com',
    phone: '+1 (512) 883-9102',
    sourceForm: 'Sell-Side Advisory Website Form',
    submittedAt: 'Today, 10:15 AM',
    suspectedType: 'Seller',
    status: 'New Submission',
    notes: 'Founder-led clinical pathology diagnostics software with $18M ARR looking to evaluate a majority buyout or growth recapitalization in the next 6–9 months.',
    sector: 'Healthcare IT',
    location: 'Dallas, TX',
    revenue: '$18M',
    growth: '28%',
    margin: '22%',
    retention: '114%',
    goal: 'Explore majority buyout vs. growth recapitalization',
    timing: '6–9 months',
    tags: ['Founder-led', 'Diagnostic SaaS', 'US'],
    researchNotes: 'Cap table confirmed: 82% founder-held, zero institutional debt. High customer renewal rate and HIPAA compliance verified.'
  },
  {
    id: 'ld2',
    company: 'Apex Horizon Capital',
    name: 'Elena Rostova',
    email: 'elena@apexhorizon.com',
    phone: '+1 (212) 749-3801',
    sourceForm: 'LP & Co-Investor Portal Inquiry',
    submittedAt: 'Yesterday, 4:30 PM',
    suspectedType: 'Investor',
    status: 'Under Research',
    notes: 'New $350M tech buyout fund seeking control investments in B2B financial infrastructure and regulatory software ($20M–$60M equity check).',
    sector: 'Financial Technology',
    investorType: 'Private Equity',
    sectors: ['Financial Technology', 'Data & Analytics'],
    stages: ['Growth', 'Buyout'],
    check: '$20M–$60M',
    geography: 'North America / UK',
    tags: ['Fund III', 'Buyout', 'B2B Software'],
    researchNotes: 'Managing Director confirmed Fund III final close in Q2 2026. Target company EBITDA range: $4M–$12M.'
  },
  {
    id: 'ld3',
    company: 'GreenTree Logistics Software',
    name: 'Marcus Thorne',
    email: 'mthorne@greentreelog.io',
    phone: '+1 (404) 912-4490',
    sourceForm: 'Executive Conference Briefing Request',
    submittedAt: 'Oct 11, 2026',
    suspectedType: 'Seller',
    status: 'Under Research',
    notes: 'Supply chain routing and fleet automation platform for regional distributors. $12M revenue, 35% YoY growth. Interested in exploring strategic merger or private equity recap.',
    sector: 'Commerce Technology',
    location: 'Atlanta, GA',
    revenue: '$12M',
    growth: '35%',
    margin: '14%',
    retention: '108%',
    goal: 'Strategic merger or private equity recap',
    timing: '3–6 months',
    tags: ['Logistics SaaS', 'Supply Chain', 'US'],
    researchNotes: 'Audited financials in order. Customer concentration is well-distributed under 8% per account.'
  },
  {
    id: 'ld4',
    company: 'BlueSky Strategic Partners',
    name: 'Jonathan Vance',
    email: 'jvance@bluesky-cap.com',
    phone: '+1 (312) 554-1920',
    sourceForm: 'Syndicate & Co-investment Request',
    submittedAt: 'Oct 9, 2026',
    suspectedType: 'Investor',
    status: 'New Submission',
    notes: 'Family office direct investment arm seeking minority growth investments ($10M–$25M) in tech-enabled education and health services.',
    sector: 'Education Technology',
    investorType: 'Family Office',
    sectors: ['Education Technology', 'Healthcare IT'],
    stages: ['Growth', 'Series B'],
    check: '$10M–$25M',
    geography: 'North America',
    tags: ['Direct Co-invest', 'Patient Capital'],
    researchNotes: 'Long-term patient capital horizon (7-10+ years). Looking for founder-friendly governance.'
  },
  {
    id: 'ld5',
    company: 'Solaria Crypto Systems',
    name: 'Dmitri Volkov',
    email: 'dmitri@solariacrypto.io',
    phone: '+1 (415) 890-1122',
    sourceForm: 'General Advisory Website Form',
    submittedAt: 'Oct 8, 2026',
    suspectedType: 'Seller',
    status: 'Disqualified',
    notes: 'Cryptocurrency trading bot seeking $50M SPAC advisory. Lack of audited financial statements, unregulated offshore token model.',
    sector: 'Financial Technology',
    location: 'Miami, FL',
    revenue: '$4M',
    growth: '-12%',
    margin: 'Unknown',
    retention: '45%',
    goal: 'SPAC listing / token liquidity sale',
    timing: 'Immediate',
    tags: ['Crypto', 'Disqualified', 'High Risk'],
    disqualificationReason: 'Outside institutional advisory mandate: unregulated token asset, unaudited financials, and high regulatory risk.',
    researchNotes: 'Screening concluded: Does not satisfy Zeon advisory standards or compliance guidelines.'
  }
];

const seedOngoingDeals = [
  {
    id: 'deal-1',
    title: 'Northstar Care × Cobalt Capital Partners',
    sellerId: 's1',
    sellerName: 'Northstar Care',
    sellerSector: 'Healthcare IT',
    sellerRevenue: '$26M',
    investorId: 'i1',
    investorName: 'Cobalt Capital Partners',
    investorType: 'Growth Equity',
    investorCheck: '$20M–$50M',
    dealSize: '$48M Valuation',
    stage: 'LOI & Exclusivity',
    leadBanker: 'Maya Chen',
    matchScore: 94,
    initiatedAt: 'Oct 4, 2026',
    expectedClose: 'Nov 2026',
    notes: 'Signed 45-day exclusivity LOI. Confirmatory Quality of Earnings (QoE) underway with KPMG.',
    milestones: [
      { name: 'Mutual NDA Executed', done: true, date: 'Oct 5' },
      { name: 'CIM & Financial Model Shared', done: true, date: 'Oct 10' },
      { name: 'IOI Received & Evaluated', done: true, date: 'Oct 18' },
      { name: 'LOI Executed & Exclusivity Grant', done: true, date: 'Oct 28' },
      { name: 'Confirmatory QoE & Legal DD', done: false, date: 'Target Nov 15' },
      { name: 'Definitive Agreement & Closing', done: false, date: 'Target Nov 30' }
    ]
  },
  {
    id: 'deal-2',
    title: 'Northstar Care × Harborline Capital',
    sellerId: 's1',
    sellerName: 'Northstar Care',
    sellerSector: 'Healthcare IT',
    sellerRevenue: '$26M',
    investorId: 'i2',
    investorName: 'Harborline Capital',
    investorType: 'Private Equity',
    investorCheck: '$30M–$75M',
    dealSize: '$52M Majority Recap',
    stage: 'IOI Submitted',
    leadBanker: 'Maya Chen',
    matchScore: 89,
    initiatedAt: 'Oct 7, 2026',
    expectedClose: 'Dec 2026',
    notes: 'Parallel indication received. Secondary institutional bidder evaluating strategic valuation.',
    milestones: [
      { name: 'Mutual NDA Executed', done: true, date: 'Oct 8' },
      { name: 'CIM & Financial Model Shared', done: true, date: 'Oct 14' },
      { name: 'IOI Received ($52M Valuation)', done: true, date: 'Oct 24' },
      { name: 'Management Presentation', done: false, date: 'Pending Exclusivity Window' },
      { name: 'LOI Negotiation', done: false, date: 'Standby' }
    ]
  },
  {
    id: 'deal-3',
    title: 'CedarPay × Cobalt Capital Partners',
    sellerId: 's2',
    sellerName: 'CedarPay',
    sellerSector: 'Financial Technology',
    sellerRevenue: '$41M',
    investorId: 'i1',
    investorName: 'Cobalt Capital Partners',
    investorType: 'Growth Equity',
    investorCheck: '$20M–$50M',
    dealSize: '$70M Growth Round',
    stage: 'Confirmatory DD',
    leadBanker: 'Jordan Lee',
    matchScore: 91,
    initiatedAt: 'Sep 22, 2026',
    expectedClose: 'Nov 15, 2026',
    notes: 'Diligence in final phase. Customer reference calls completed with exceptional NPS scores.',
    milestones: [
      { name: 'Mutual NDA Executed', done: true, date: 'Sep 24' },
      { name: 'Management Meetings Completed', done: true, date: 'Oct 2' },
      { name: 'LOI Signed ($70M Valuation)', done: true, date: 'Oct 12' },
      { name: 'Confirmatory Tech & Legal DD', done: true, date: 'Oct 29' },
      { name: 'Credit Facility & Debt Financing', done: false, date: 'Target Nov 8' },
      { name: 'Closing Funds Flow Memo', done: false, date: 'Target Nov 15' }
    ]
  },
  {
    id: 'deal-4',
    title: 'BrightPath Learning × Summit Ridge Credit',
    sellerId: 's3',
    sellerName: 'BrightPath Learning',
    sellerSector: 'Education Technology',
    sellerRevenue: '$19M',
    investorId: 'i3',
    investorName: 'Summit Ridge Credit',
    investorType: 'Private Credit',
    investorCheck: '$15M–$40M',
    dealSize: '$25M Senior Secured Facility',
    stage: 'Outreach & NDA',
    leadBanker: 'Maya Chen',
    matchScore: 82,
    initiatedAt: 'Oct 11, 2026',
    expectedClose: 'Jan 2027',
    notes: 'Initial credit teaser sent. Reviewing recurring revenue leverage thresholds and covenants.',
    milestones: [
      { name: 'Teaser Review & Mutual NDA', done: true, date: 'Oct 11' },
      { name: 'Borrowing Base Model Delivery', done: false, date: 'In Progress' },
      { name: 'Term Sheet Issuance', done: false, date: 'Target Oct 25' },
      { name: 'Credit Committee Approval', done: false, date: 'Target Nov 10' }
    ]
  }
];

const seedClosedDeals = [
  {
    id: 'cd-1',
    company: 'Atlas Market Data',
    buyer: 'Silver Lake Partners',
    dealSize: '$120M',
    multiple: '3.5x ARR',
    closeDate: 'Sep 28, 2026',
    status: 'In Integration',
    integrationProgress: 75,
    dealLead: 'Jordan Lee',
    sector: 'Data & Analytics',
    type: 'Strategic Acquisition',
    summary: '100% equity acquisition of Atlas Market Data by Silver Lake portfolio co. All 84 employees retained.',
    escrowEndDate: 'Sep 28, 2027',
    escrowAmount: '$12.0M (10% Indemnity)',
    tsaPeriod: '6 Months (Ends Mar 2027)',
    tasks: [
      { id: 'c1', title: 'Confirm final funds flow & escrow wire receipts', when: 'Closing Day', done: true, person: 'Deal Lead' },
      { id: 'c2', title: 'Decommission virtual data room & archive diligence records', when: 'Within 5 Days', done: true, person: 'Operations' },
      { id: 'c3', title: 'Executive retention agreement vesting confirmation', when: '30 Days', done: true, person: 'Senior Banker' },
      { id: 'c4', title: 'Transition Services Agreement (TSA) monthly SLA review', when: '60 Days', done: false, person: 'Deal Team' },
      { id: 'c5', title: 'Working capital true-up adjustment statement settlement', when: '90 Days', done: false, person: 'Finance Lead' }
    ],
    events: [
      { id: 'e1', month: 'OCT', day: '28', title: '30-Day Operational Review & Post-Close Sync', assignee: 'Jordan Lee', tone: 'amber', status: 'Upcoming', description: 'Review billing integration, founder transition, and HR platform unification.' },
      { id: 'e2', month: 'NOV', day: '28', title: '60-Day Working Capital & TSA Milestone Check', assignee: 'Maya Chen', tone: 'blue', status: 'Scheduled', description: 'Reconcile net working capital against target and check cloud migration progress.' },
      { id: 'e3', month: 'DEC', day: '28', title: '90-Day Post-Close Board Review & Retention Audit', assignee: 'Jordan Lee', tone: 'purple', status: 'Scheduled', description: 'Audit key personnel retention packages and initial customer churn rates.' }
    ]
  },
  {
    id: 'cd-2',
    company: 'Apex Health Systems',
    buyer: 'Horizon Equity Partners',
    dealSize: '$85M',
    multiple: '4.2x Revenue',
    closeDate: 'Aug 14, 2026',
    status: 'TSA Active',
    integrationProgress: 60,
    dealLead: 'Maya Chen',
    sector: 'Healthcare IT',
    type: 'Majority Recapitalization',
    summary: 'Majority sale with founder rollover into Horizon HC vehicle. Shared IT and billing ongoing under TSA.',
    escrowEndDate: 'Aug 14, 2027',
    escrowAmount: '$8.5M',
    tsaPeriod: '9 Months (Ends May 2027)',
    tasks: [
      { id: 'c1', title: 'Wiring of closing funds and equity distribution', when: 'Closing Day', done: true, person: 'Deal Lead' },
      { id: 'c2', title: 'Decommission virtual data room and legal archive', when: 'Within 5 Days', done: true, person: 'Operations' },
      { id: 'c3', title: 'Q1 Post-close revenue retention benchmark audit', when: '90 Days', done: true, person: 'Senior Banker' },
      { id: 'c4', title: 'Mid-term TSA system migration verification', when: '120 Days', done: false, person: 'Deal Team' }
    ],
    events: [
      { id: 'e1', month: 'NOV', day: '14', title: '90-Day Post-Close Operational Review', assignee: 'Maya Chen', tone: 'blue', status: 'Scheduled', description: 'Review healthcare compliance certifications and clinical client satisfaction.' },
      { id: 'e2', month: 'FEB', day: '14', title: '6-Month TSA Transition Milestone', assignee: 'Maya Chen', tone: 'slate', status: 'Scheduled', description: 'Verify migration of independent billing system and electronic medical record links.' }
    ]
  },
  {
    id: 'cd-3',
    company: 'Vanguard Cyber Analytics',
    buyer: 'Stonepeak Tech Holdings',
    dealSize: '$165M',
    multiple: '6.1x ARR',
    closeDate: 'Jun 10, 2026',
    status: 'Escrow Period',
    integrationProgress: 90,
    dealLead: 'Jordan Lee',
    sector: 'Governance, Risk & Compliance',
    type: 'Strategic Acquisition',
    summary: 'Cross-border buyout of Vanguard Cyber Analytics by Stonepeak. Zero post-close litigation.',
    escrowEndDate: 'Jun 10, 2027',
    escrowAmount: '$16.5M',
    tsaPeriod: 'Completed (Sep 2026)',
    tasks: [
      { id: 'c1', title: 'Final closing disbursements & wire receipt verification', when: 'Closing Day', done: true, person: 'Deal Lead' },
      { id: 'c2', title: 'Regulatory notification & CFIUS filings clearance', when: 'Closing Day', done: true, person: 'Legal Counsel' },
      { id: 'c3', title: 'TSA completion certification & operational handover', when: '90 Days', done: true, person: 'Deal Team' },
      { id: 'c4', title: 'Year-one indemnity & escrow release reconciliation', when: '365 Days', done: false, person: 'Finance Lead' }
    ],
    events: [
      { id: 'e1', month: 'DEC', day: '10', title: '6-Month Escrow Review & Indemnity Check', assignee: 'Jordan Lee', tone: 'purple', status: 'Scheduled', description: 'Review if any buyer warranty claims have been served prior to 6-month threshold.' },
      { id: 'e2', month: 'JUN', day: '10', title: '1-Year Escrow Release & Final Signoff', assignee: 'Jordan Lee', tone: 'green', status: 'Scheduled', description: 'Authorize joint escrow instruction letter for release of remaining $16.5M.' }
    ]
  }
];

const navGroups = [
  { label:'WORKSPACE', items:[
    { id:'overview', label:'Overview', icon:LayoutDashboard },
    { id:'ongoing', label:'Ongoing deals', icon:Handshake },
    { id:'leads', label:'Inbound leads', icon:Inbox },
    { id:'sellers', label:'Seller pipeline', icon:Building2 },
    { id:'investors', label:'Investor network', icon:UsersRound },
    { id:'matching', label:'Matchmaking', icon:ArrowRightLeft },
    { id:'readiness', label:'Seller readiness', icon:ListChecks }
  ]},
  { label:'DEAL EXECUTION', items:[
    { id:'blind', label:'Blind outreach', icon:EyeOff },
    { id:'investments', label:'Principal investments', icon:CircleDollarSign },
    { id:'afterclose', label:'After the deal', icon:ClipboardCheck }
  ]}
];

const viewInfo = {
  overview: ['Overview', 'Executive dealflow workspace, stage funnel, and active transactions.'],
  leads: ['Inbound leads', 'Review, research, and qualify incoming website and referral form submissions.'],
  sellers: ['Seller pipeline', 'Interactive Attio-style Kanban pipeline and table views across all seller mandates.'],
  investors: ['Investor network', 'Capital partners, target check sizes, and relationship stages.'],
  matching: ['Matchmaking', 'Find likely investor fits using seller needs and investor preferences.'],
  ongoing: ['Ongoing deals', 'Manage live transactions, diligence milestones, and deal progression across active mandates.'],
  readiness: ['Seller readiness', 'See what is ready, what is missing, and what could delay launch.'],
  blind: ['Blind outreach', 'Share an approved anonymous company profile and collect early interest.'],
  investments: ['Principal investments', 'Screen opportunities for Zeon’s own capital, separate from client advisory work.'],
  afterclose: ['After the deal', 'Track closeout, handoffs, and agreed follow-up across all closed transactions.'],
  tasks: ['Tasks & follow-ups', 'Attio-style task board with assigned owners and due dates.']
};

/* ==========================================================================
   HELPER UTILITIES & COMMON COMPONENTS
   ========================================================================== */

function IconButton({ children, onClick, title, className='' }) {
  return <button type="button" className={`icon-button ${className}`} onClick={onClick} title={title}>{children}</button>;
}

function Badge({ children, tone='default' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

/* ==========================================================================
   CORPORATE BRAND LOGOS & VECTOR MARKS
   ========================================================================== */

function CompanyLogo({ name = '', initials = '', color = 'teal', size = 'md', className = '' }) {
  const normName = (name || '').trim().toLowerCase();
  const displayInitials = (initials || (name ? name.split(' ').map(w => w[0]).join('').slice(0, 2) : 'CO')).toUpperCase();

  // 1. Northstar Care - Radiant 4-point Compass Star & Clinical Core (Teal / Emerald)
  if (normName.includes('northstar')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'Northstar Care'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-nc)" />
          <path d="M18 5L20.8 14.2L30 17L20.8 19.8L18 29L15.2 19.8L6 17L15.2 14.2L18 5Z" fill="white" />
          <circle cx="18" cy="17" r="3.2" fill="#042f2e" opacity="0.75" />
          <circle cx="18" cy="17" r="1.6" fill="#99f6e4" />
          <defs>
            <linearGradient id="grad-nc" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0d9488" />
              <stop offset="1" stopColor="#065f46" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 2. CedarPay - Interlocking Fintech Shield & Digital Wave (Indigo / Violet)
  if (normName.includes('cedar')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'CedarPay'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-cp)" />
          <path d="M18 7.5L27 11.5V18C27 23.5 23.2 28.5 18 30C12.8 28.5 9 23.5 9 18V11.5L18 7.5Z" fill="white" fillOpacity="0.18" />
          <path d="M18 10L25 13.5V18C25 22.2 22 26 18 27.2C14 26 11 22.2 11 18V13.5L18 10Z" stroke="white" strokeWidth="1.8" />
          <path d="M14 19C15.5 17 17 16 19 16C21.5 16 23 18 24 18" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="18" r="2.2" fill="white" />
          <defs>
            <linearGradient id="grad-cp" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#3730a3" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 3. BrightPath Learning - Ascending Path Beacon & Solar Sunburst (Coral / Amber)
  if (normName.includes('brightpath')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'BrightPath Learning'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-bl)" />
          <circle cx="18" cy="11.5" r="4.5" fill="#fef08a" />
          <path d="M10 27L15 18H21L26 27H10Z" fill="white" fillOpacity="0.9" />
          <path d="M18 18V27" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" />
          <defs>
            <linearGradient id="grad-bl" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f97316" />
              <stop offset="1" stopColor="#c2410c" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 4. Atlas Market Data - Geodesic Data Globe & Orbital Rings (Sapphire / Cobalt)
  if (normName.includes('atlas')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'Atlas Market Data'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-amd)" />
          <circle cx="18" cy="18" r="9" stroke="white" strokeWidth="1.8" />
          <ellipse cx="18" cy="18" rx="4.5" ry="9" stroke="white" strokeWidth="1.4" opacity="0.85" />
          <line x1="9" y1="18" x2="27" y2="18" stroke="white" strokeWidth="1.4" opacity="0.85" />
          <circle cx="23" cy="13" r="2" fill="#67e8f9" />
          <defs>
            <linearGradient id="grad-amd" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563eb" />
              <stop offset="1" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 5. Fieldnote Commerce - Faceted Inventory Node & Retail Hexagon (Amber / Bronze)
  if (normName.includes('fieldnote')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'Fieldnote Commerce'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-fc)" />
          <path d="M18 9L26 13.5V22.5L18 27L10 22.5V13.5L18 9Z" stroke="white" strokeWidth="1.8" fill="white" fillOpacity="0.15" />
          <path d="M18 9V27M10 13.5L26 22.5M10 22.5L26 13.5" stroke="white" strokeWidth="1.2" opacity="0.75" />
          <circle cx="18" cy="18" r="2.5" fill="#fef08a" />
          <defs>
            <linearGradient id="grad-fc" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d97706" />
              <stop offset="1" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 6. Cobalt Growth Partners / Capital - Multi-Faceted Crystal Diamond (Navy / Cobalt)
  if (normName.includes('cobalt')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'Cobalt Capital'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-cg)" />
          <path d="M18 7.5L27 15L18 28.5L9 15L18 7.5Z" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.6" />
          <path d="M13 15H23M18 7.5V28.5" stroke="white" strokeWidth="1.2" opacity="0.8" />
          <circle cx="18" cy="15" r="2.2" fill="#93c5fd" />
          <defs>
            <linearGradient id="grad-cg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e40af" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 7. Harborline Capital - Maritime Beacon & Coastal Horizon (Cyan / Deep Teal)
  if (normName.includes('harborline')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'Harborline Capital'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-hc)" />
          <path d="M15 28L17 13H19L21 28H15Z" fill="white" />
          <circle cx="18" cy="11" r="3" fill="#fef08a" />
          <path d="M8 22C11 20.5 14 23 18 21.5C22 20 25 22.5 28 21" stroke="#a5f3fc" strokeWidth="1.8" strokeLinecap="round" />
          <defs>
            <linearGradient id="grad-hc" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0891b2" />
              <stop offset="1" stopColor="#134e4a" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 8. Foundry Ventures - Geometric Anvil & Molten Spark (Violet / Purple)
  if (normName.includes('foundry')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'Foundry Ventures'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-fv)" />
          <path d="M9 13H27V17L22 20V26H14V20L9 17V13Z" fill="white" fillOpacity="0.22" stroke="white" strokeWidth="1.6" />
          <circle cx="18" cy="16" r="3" fill="#f43f5e" />
          <path d="M18 10V12M24 10L23 12M12 10L13 12" stroke="#fbcfe8" strokeWidth="1.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="grad-fv" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#4c1d95" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 9. Meridian Strategic Group - Planetary Meridian Ellipse & Axis Star (Terracotta / Copper)
  if (normName.includes('meridian')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'Meridian Strategic'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-ms)" />
          <ellipse cx="18" cy="18" rx="10" ry="5" stroke="white" strokeWidth="1.8" transform="rotate(-30 18 18)" />
          <circle cx="18" cy="18" r="4" fill="#fed7aa" />
          <circle cx="18" cy="18" r="1.5" fill="#7c2d12" />
          <defs>
            <linearGradient id="grad-ms" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ea580c" />
              <stop offset="1" stopColor="#7c2d12" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 10. Summit Ridge Credit - Alpine Dual Summits (Sky / Slate Blue)
  if (normName.includes('summit ridge')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'Summit Ridge'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-sr)" />
          <path d="M7 26L16 12L21 19L24 15L29 26H7Z" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M16 12L18 16L15 18L16 12Z" fill="white" />
          <defs>
            <linearGradient id="grad-sr" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 11. Oak & Union Partners - Twin Leaf Arc & Union Crest (Gold Bronze)
  if (normName.includes('oak & union') || normName.includes('oak union')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'Oak & Union Partners'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-ou)" />
          <circle cx="18" cy="18" r="9" stroke="white" strokeWidth="1.6" strokeDasharray="3 2" />
          <path d="M18 10C13 13 13 23 18 26C23 23 23 13 18 10Z" fill="white" fillOpacity="0.85" />
          <defs>
            <linearGradient id="grad-ou" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ca8a04" />
              <stop offset="1" stopColor="#581c87" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 12. Vanguard Diagnostics (Lead) - Medical Diagnostics Hexagon & Cross (Emerald)
  if (normName.includes('vanguard')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'Vanguard Diagnostics'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-vd)" />
          <path d="M18 7.5L26 12.5V23.5L18 28.5L10 23.5V12.5L18 7.5Z" stroke="white" strokeWidth="1.6" fill="white" fillOpacity="0.1" />
          <path d="M16 13.5H20V16.5H23V20.5H20V23.5H16V20.5H13V16.5H16V13.5Z" fill="white" />
          <defs>
            <linearGradient id="grad-vd" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="1" stopColor="#047857" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 13. Apex Horizon Capital (Lead) - Triple Chevron Ascending Horizon (Royal Purple)
  if (normName.includes('apex horizon')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'Apex Horizon Capital'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-ah)" />
          <path d="M10 24L18 16L26 24" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 18L18 12L23 18" stroke="#ddd6fe" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="grad-ah" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7c3aed" />
              <stop offset="1" stopColor="#3b0764" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 14. GreenTree Logistics Software (Lead) - Tree Crown & Logistics Routing (Forest Green)
  if (normName.includes('greentree')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'GreenTree Logistics'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-gt)" />
          <path d="M18 8L25 17H20V27H16V17H11L18 8Z" fill="white" />
          <circle cx="18" cy="8" r="2.2" fill="#86efac" />
          <circle cx="11" cy="17" r="1.8" fill="#86efac" />
          <circle cx="25" cy="17" r="1.8" fill="#86efac" />
          <defs>
            <linearGradient id="grad-gt" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#16a34a" />
              <stop offset="1" stopColor="#14532d" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 15. BlueSky Strategic Partners (Lead) - Ascending Aerofoil Wings (Azure Cyan)
  if (normName.includes('bluesky')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'BlueSky Strategic'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-bs)" />
          <path d="M9 22C14 20 20 15 27 10C24 16 19 22 13 25" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M12 26C16 24 20 20 25 16" stroke="#bae6fd" strokeWidth="1.6" strokeLinecap="round" />
          <defs>
            <linearGradient id="grad-bs" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284c7" />
              <stop offset="1" stopColor="#075985" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // 16. Solaria Crypto Systems (Lead) - Fractured Sunburst & Token (Ruby Red)
  if (normName.includes('solaria')) {
    return (
      <span className={`company-logo company-logo-${size} ${className}`} title={name || 'Solaria Crypto'}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#grad-sc)" />
          <circle cx="18" cy="18" r="8" stroke="white" strokeWidth="1.8" strokeDasharray="3 2" />
          <path d="M15 13L21 23M21 13L15 23" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="grad-sc" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ef4444" />
              <stop offset="1" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  // DYNAMIC PROCEDURAL GENERATOR for any other/new company added by user
  const paletteIndex = Math.abs((name || initials || 'co').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 8;
  const palettes = [
    { start: '#0d9488', end: '#115e59', text: '#ffffff', accent: '#99f6e4' }, // Teal
    { start: '#2563eb', end: '#1e40af', text: '#ffffff', accent: '#bfdbfe' }, // Blue
    { start: '#7c3aed', end: '#5b21b6', text: '#ffffff', accent: '#ddd6fe' }, // Purple
    { start: '#d97706', end: '#92400e', text: '#ffffff', accent: '#fde68a' }, // Amber
    { start: '#059669', end: '#065f46', text: '#ffffff', accent: '#a7f3d0' }, // Emerald
    { start: '#0891b2', end: '#164e63', text: '#ffffff', accent: '#a5f3fc' }, // Cyan
    { start: '#e11d48', end: '#9f1239', text: '#ffffff', accent: '#fecdd3' }, // Rose
    { start: '#4f46e5', end: '#312e81', text: '#ffffff', accent: '#c7d2fe' }  // Indigo
  ];
  const p = palettes[paletteIndex];
  const gradId = `pgrad-${paletteIndex}-${normName.replace(/[^a-z0-9]/g, '').slice(0, 6) || 'co'}`;

  return (
    <span className={`company-logo company-logo-${size} ${className}`} title={name || displayInitials}>
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="8" fill={`url(#${gradId})`} />
        <circle cx="18" cy="18" r="14" stroke={p.accent} strokeWidth="0.8" opacity="0.3" strokeDasharray="3 3" />
        <rect x="5" y="5" width="26" height="26" rx="6" stroke="white" strokeWidth="0.75" opacity="0.25" />
        <text
          x="18"
          y="23"
          textAnchor="middle"
          fill={p.text}
          fontFamily="Manrope, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="12.5"
          letterSpacing="-0.03em"
        >
          {displayInitials}
        </text>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor={p.start} />
            <stop offset="1" stopColor={p.end} />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

function Avatar({ initials, color='navy', size='md', name='', isPerson=false, className='' }) {
  // If explicitly flagged as a banker or matching banker initials, render banker personal badge
  if (isPerson || initials === 'MC' || initials === 'JL' || initials === 'MD' || initials === 'TC' || initials === 'KS') {
    return <span className={`avatar avatar-${color} avatar-${size} ${className}`}>{initials}</span>;
  }
  // Otherwise, delegate to CompanyLogo for corporate entities
  return <CompanyLogo name={name} initials={initials} color={color} size={size} className={className} />;
}

function ProgressBar({ value, color='teal' }) {
  return <div className="progress-track"><span className={`progress-fill fill-${color}`} style={{ width:`${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

function MetricCard({ label, value, change, icon:Icon, tone='teal', note }) {
  return <article className="metric-card">
    <div className={`metric-icon metric-${tone}`}><Icon size={18} strokeWidth={2} /></div>
    <div className="metric-copy"><span>{label}</span><strong>{value}</strong><small className={change?.startsWith('+') ? 'positive' : ''}>{change || note}</small></div>
    <ArrowUpRight className="metric-arrow" size={16} />
  </article>;
}

function EmptyState({ title, message }) {
  return <div className="empty-state"><div className="empty-icon"><Search size={21} /></div><strong>{title}</strong><span>{message}</span></div>;
}

function TableRow({ seller, onClick }) {
  const stageTone = { 'Qualified':'green','Preparing':'blue','Nurture':'amber','In Market':'purple','New':'slate' }[seller.stage] || 'slate';
  return <tr onClick={onClick} className="clickable-row">
    <td><div className="company-cell"><CompanyLogo name={seller.name} initials={seller.initials} size="md" /><div><strong>{seller.name}</strong><span>{seller.source}</span></div></div></td>
    <td>{seller.sector}</td><td className="numeric-cell">{seller.revenue}</td>
    <td><Badge tone={stageTone}>{seller.stage}</Badge></td>
    <td><span className="fit-score"><span className="fit-dot" />{seller.fit}%</span></td>
    <td><div className="next-step-cell"><span>{seller.next}</span><small>{seller.updated}</small></div></td>
    <td><MoreHorizontal size={18} className="muted-icon" /></td>
  </tr>;
}

function getInvestorMatchScore(investor, seller) {
  if (!investor || !seller) return 55;
  let score = 55;
  if ((investor.sectors || []).includes(seller.sector)) score += 24;
  const geography = investor.geography || '';
  if (geography.includes('North America') || geography.includes('US') || geography === 'Global') score += 8;
  if ((investor.stages || []).some(stage => ['Growth','Series B','Series C'].includes(stage))) score += 8;
  return Math.min(score, 97);
}

function CustomSellerSelect({ sellers, selectedSellerId, onSelect, label = 'ACTIVE SELLER', className = '', align = 'right' }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedSeller = sellers.find(s => s.id === selectedSellerId) || sellers[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`custom-dropdown-container ${open ? 'is-open' : ''} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="custom-dropdown-trigger"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Avatar initials={selectedSeller?.initials} color={selectedSeller?.color} size="sm" />
        <div className="custom-dropdown-info">
          <span className="custom-dropdown-label">{label}</span>
          <span className="custom-dropdown-value">
            {selectedSeller?.name} <span className="custom-dropdown-sub">· {selectedSeller?.sector}</span>
          </span>
        </div>
        <ChevronDown size={16} className={`custom-dropdown-arrow ${open ? 'rotated' : ''}`} />
      </button>

      {open && (
        <div className={`custom-dropdown-menu align-${align}`} role="listbox">
          <div className="custom-dropdown-menu-header">
            <span>Select Portfolio Company</span>
            <span className="custom-dropdown-count">{sellers.length} available</span>
          </div>
          <div className="custom-dropdown-options">
            {sellers.map(s => {
              const isSelected = s.id === selectedSeller?.id;
              return (
                <button
                  type="button"
                  key={s.id}
                  role="option"
                  aria-selected={isSelected}
                  className={`custom-dropdown-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelect(s.id);
                    setOpen(false);
                  }}
                >
                  <Avatar initials={s.initials} color={s.color} size="xs" />
                  <div className="custom-dropdown-item-text">
                    <strong>{s.name}</strong>
                    <span>{s.sector} • {s.revenue}</span>
                  </div>
                  {isSelected && <Check size={16} className="custom-dropdown-check" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomSelect({ value, options, onChange, placeholder = 'Select...', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => (typeof o === 'string' ? o : o.value) === value);
  const selectedLabel = typeof selectedOption === 'string' ? selectedOption : selectedOption?.label || selectedOption?.value || value;

  return (
    <div className={`custom-filter-dropdown ${open ? 'is-open' : ''} ${className}`} ref={ref}>
      <button
        type="button"
        className="custom-filter-trigger"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="custom-filter-trigger-text">{selectedLabel || placeholder}</span>
        <ChevronDown size={15} className={`custom-filter-arrow ${open ? 'rotated' : ''}`} />
      </button>

      {open && (
        <div className="custom-filter-menu" role="listbox">
          {options.map((opt, i) => {
            const optVal = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            const isSelected = optVal === value;
            return (
              <button
                type="button"
                key={i}
                role="option"
                aria-selected={isSelected}
                className={`custom-filter-item ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onChange(optVal);
                  setOpen(false);
                }}
              >
                <span>{optLabel}</span>
                {isSelected && <Check size={14} className="custom-filter-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   ROOT HOME COMPONENT
   ========================================================================== */

export default function Home() {
  const [view, setView] = useState('overview');
  const [sellers, setSellers] = useState(seedSellers);
  const [investors, setInvestors] = useState(seedInvestors);
  const [tasks, setTasks] = useState(seedTasks);
  const [leads, setLeads] = useState(seedLeads);
  const [sellerCustomFields, setSellerCustomFields] = useState(defaultSellerCustomFields);
  const [investorCustomFields, setInvestorCustomFields] = useState(defaultInvestorCustomFields);
  const [readyState, setReadyState] = useState({ s1:[true,true,false,false,true], s2:[true,true,true,false,true] });
  const [searchText, setSearchText] = useState('');
  const [stageFilter, setStageFilter] = useState('All sellers');
  const [sectorFilter, setSectorFilter] = useState('All sectors');
  const [selectedSellerId, setSelectedSellerId] = useState('s1');
  const [selectedInvestorId, setSelectedInvestorId] = useState('i1');
  const [drawerSeller, setDrawerSeller] = useState(null);
  const [drawerInvestor, setDrawerInvestor] = useState(null);
  const [detailProfile, setDetailProfile] = useState(null);
  const [modal, setModal] = useState(null);
  const [leadModal, setLeadModal] = useState(null);
  const [customFieldModal, setCustomFieldModal] = useState(null);
  const [docPreviewModal, setDocPreviewModal] = useState(null);
  const [emailConfigModal, setEmailConfigModal] = useState(false);
  const [toast, setToast] = useState('');
  const [blindApproved, setBlindApproved] = useState(false);
  const [outreachApproved, setOutreachApproved] = useState(false);
  const [blindSent, setBlindSent] = useState(false);
  const [ndaVerified, setNdaVerified] = useState(false);
  const [identityApproved, setIdentityApproved] = useState(false);
  const [identityDisclosureAuthorized, setIdentityDisclosureAuthorized] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState({
    name: 'Maya Chen',
    email: 'maya.chen@zeondealbridge.com',
    title: 'Managing Director',
    provider: 'Google Workspace',
    status: 'Connected',
    signature: 'Maya Chen | Managing Director\nZeon DealBridge Investment Banking\n100 Congress Ave, Suite 1900, Austin, TX'
  });
  const [terms, setTerms] = useState([
    { investor:'Cobalt Growth Partners', range:'$30M–$35M', structure:'Growth equity', conditions:'Board seat; standard diligence', status:'Received' },
    { investor:'Harborline Capital', range:'$32M', structure:'Majority investment', conditions:'Management rollover', status:'Received' },
    { investor:'Summit Ridge Credit', range:'$20M facility', structure:'Credit facility', conditions:'Leverage and reporting tests', status:'Requested' }
  ]);
  const [ongoingDeals, setOngoingDeals] = useState(seedOngoingDeals);
  const [closedDeals, setClosedDeals] = useState(seedClosedDeals);
  const [disqualifyPrompt, setDisqualifyPrompt] = useState(null);
  const [initiateDealModal, setInitiateDealModal] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('dealflow-prototype-v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sellers) setSellers(parsed.sellers);
        if (parsed.investors) setInvestors(parsed.investors);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.leads) {
          const existingIds = new Set(parsed.leads.map(l => l.id));
          const missingSeeds = seedLeads.filter(sl => !existingIds.has(sl.id));
          setLeads([...parsed.leads, ...missingSeeds]);
        }
        if (parsed.readyState) setReadyState(parsed.readyState);
        if (parsed.terms) setTerms(parsed.terms);
        if (parsed.sellerCustomFields) setSellerCustomFields(parsed.sellerCustomFields);
        if (parsed.investorCustomFields) setInvestorCustomFields(parsed.investorCustomFields);
        if (parsed.connectedEmail) setConnectedEmail(parsed.connectedEmail);
        if (parsed.ongoingDeals) {
          const existingDealIds = new Set(parsed.ongoingDeals.map(d => d.id));
          const missingDeals = seedOngoingDeals.filter(sd => !existingDealIds.has(sd.id));
          setOngoingDeals([...parsed.ongoingDeals, ...missingDeals]);
        }
        if (parsed.closedDeals) {
          const existingClosedIds = new Set(parsed.closedDeals.map(cd => cd.id));
          const missingClosed = seedClosedDeals.filter(scd => !existingClosedIds.has(scd.id));
          setClosedDeals([...parsed.closedDeals, ...missingClosed]);
        }
      }
    } catch (e) {
      // In-memory demo fallback
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem('dealflow-prototype-v1', JSON.stringify({
        sellers, investors, tasks, readyState, terms, leads,
        sellerCustomFields, investorCustomFields, connectedEmail,
        ongoingDeals, closedDeals
      }));
    } catch (e) {}
  }, [loaded, sellers, investors, tasks, readyState, terms, leads, sellerCustomFields, investorCustomFields, connectedEmail, ongoingDeals, closedDeals]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3400);
    return () => clearTimeout(timer);
  }, [toast]);

  const selectedSeller = sellers.find(s => s.id === selectedSellerId) || sellers[0];
  const selectedInvestor = investors.find(i => i.id === selectedInvestorId) || investors[0];

  const openSeller = (seller) => {
    setDetailProfile(null);
    setSelectedSellerId(seller.id);
    setDrawerInvestor(null);
    setDrawerSeller(seller);
  };

  const openInvestor = (investor, preferredSellerId) => {
    setDetailProfile(null);
    setSelectedInvestorId(investor.id);
    const bestSeller = [...sellers].sort((a,b)=>getInvestorMatchScore(investor,b)-getInvestorMatchScore(investor,a))[0];
    setSelectedSellerId(preferredSellerId || bestSeller?.id || selectedSellerId);
    setDrawerSeller(null);
    setDrawerInvestor(investor);
  };

  const openDetailProfile = (type, record, preferredSellerId) => {
    setDrawerSeller(null);
    setDrawerInvestor(null);
    if(type==='seller') {
      setSelectedSellerId(record.id);
      const activeSeller = sellers.find(s=>s.id===record.id) || record;
      setDetailProfile({type, record: activeSeller});
    } else {
      setSelectedInvestorId(record.id);
      const bestSeller=[...sellers].sort((a,b)=>getInvestorMatchScore(record,b)-getInvestorMatchScore(record,a))[0];
      setSelectedSellerId(preferredSellerId || bestSeller?.id || selectedSellerId);
      const activeInvestor = investors.find(i=>i.id===record.id) || record;
      setDetailProfile({type, record: activeInvestor});
    }
  };

  const activeTitle = detailProfile
    ? [detailProfile.record.name, detailProfile.type==='seller'?'Seller detail profile':'Investor detail profile']
    : (viewInfo[view] || viewInfo.overview);

  const filteredSellers = useMemo(() => sellers.filter(seller => {
    const q = searchText.toLowerCase();
    const matchesSearch = !q || [seller.name,seller.sector,seller.source,seller.owner].join(' ').toLowerCase().includes(q);
    const matchesStage = stageFilter === 'All sellers' || seller.stage === stageFilter;
    const matchesSector = sectorFilter === 'All sectors' || seller.sector === sectorFilter;
    return matchesSearch && matchesStage && matchesSector;
  }), [sellers, searchText, stageFilter, sectorFilter]);

  const addSeller = (form) => {
    const initials = form.name.split(/\s+/).slice(0,2).map(w=>w[0]?.toUpperCase()).join('') || 'CO';
    const newSeller = {
      id:`s${Date.now()}`, name:form.name, initials, sector:form.sector || 'Healthcare IT', revenue:form.revenue || '—',
      stage:'New', fit:50, source:form.source || 'Direct inquiry', updated:'Just now', next:'Review new lead',
      location:form.location || 'Not set', goal:form.goal || 'To be confirmed', growth:'—', margin:'—', retention:'—',
      timing:'To be confirmed', owner:'Unassigned', color:'blue', prep:0,
      contactEmail: form.email || `${form.name.toLowerCase().replace(/[^a-z0-9]/g,'')}@example.com`,
      summary:form.goal || form.summary || 'New seller lead. Add more detail after the first conversation.',
      tags:[form.sector || 'Technology', 'New lead'],
      customFieldValues: {}
    };
    setSellers(current => [newSeller, ...current]);
    setSelectedSellerId(newSeller.id);
    setModal(null);
    setToast('Seller lead added to the pipeline');
  };

  const addInvestor = (form) => {
    const initials = form.name.split(/\s+/).slice(0,2).map(w=>w[0]?.toUpperCase()).join('') || 'IN';
    const investor = {
      id:`i${Date.now()}`, name:form.name, initials, type:form.type || 'Growth Equity',
      sectors:[form.sector || 'Healthcare IT'], stages:['Growth'], check:form.check || 'To confirm',
      geography:form.geography || 'North America', status:'New', lastTouch:'Just added', color:'teal',
      contactEmail: form.email || `${form.name.toLowerCase().replace(/[^a-z0-9]/g,'')}@capital.com`,
      description:form.notes || 'New investor profile. Confirm preferences before matching.',
      customFieldValues: {}
    };
    setInvestors(current => [investor, ...current]);
    setSelectedInvestorId(investor.id);
    setModal(null);
    setToast('Investor profile added');
  };

  const toggleTask = (taskId) => setTasks(current => current.map(task => task.id === taskId ? { ...task, done:!task.done } : task));
  const updateStage = (id, stage) => {
    setSellers(current => current.map(s => s.id === id ? { ...s, stage, updated:'Just now' } : s));
    setDrawerSeller(null);
    setToast(`Seller moved to ${stage}`);
  };
  const updateSellerStage = (id, stage) => {
    setSellers(current => current.map(s => s.id === id ? { ...s, stage, updated:'Just now' } : s));
    setToast(`Seller moved to ${stage}`);
  };
  const updateDealStage = (dealId, stage) => {
    if (stage === 'Closed') {
      const deal = ongoingDeals.find(d => d.id === dealId);
      if (deal) closeOngoingDeal(deal);
      return;
    }
    setOngoingDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage } : d));
    setToast(`Deal moved to ${stage}`);
  };
  const updateLeadStatus = (leadId, status) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
    setToast(`Lead updated to ${status}`);
  };
  const updateTaskStatus = (taskId, status) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status, done: status === 'Done' } : t));
    setToast(`Task moved to ${status}`);
  };
  const updateInvestorStatus = (investorId, status) => {
    setInvestors(prev => prev.map(i => i.id === investorId ? { ...i, status } : i));
    setToast(`Investor status updated to ${status}`);
  };
  const toggleReady = (sellerId, index) => {
    setReadyState(current => {
      const list = current[sellerId] || [false,false,false,false,false];
      const next = [...list]; next[index] = !next[index];
      return { ...current, [sellerId]:next };
    });
  };
  const handleSendBlind = () => {
    if (!blindApproved || !outreachApproved) return;
    setBlindSent(true);
    setToast('Anonymous teaser marked as sent (demo only)');
  };
  const addTask = (form) => {
    const newTask = { id:`t${Date.now()}`, title:form.name, company:form.company || 'General', due:form.due || 'Tomorrow', owner:form.owner || 'Maya Chen', kind:form.kind || 'Follow-up', done:false };
    setTasks(current => [newTask, ...current]);
    setModal(null);
    setToast('Task added to follow-ups');
  };
  const addTerm = (form) => {
    setTerms(current => [{ investor:form.investor || 'New investor', range:form.range || 'To confirm', structure:form.structure || 'To confirm', conditions:form.conditions || 'Not provided', status:'Received' }, ...current]);
    setModal(null);
    setToast('Early terms recorded');
  };

  /* Inbound Leads Qualification Handlers */
  const qualifyLeadAsSeller = (lead) => {
    const initials = lead.company.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || 'CO';
    const newSeller = {
      id: `s${Date.now()}`,
      name: lead.company,
      initials,
      sector: lead.sector || 'Healthcare IT',
      revenue: lead.revenue || '$15M',
      stage: 'Qualified',
      fit: 86,
      source: `Inbound (${lead.sourceForm || 'Website Form'})`,
      updated: 'Just now',
      next: 'Schedule introductory valuation briefing',
      location: lead.location || 'United States',
      goal: lead.goal || 'Explore strategic buyout or growth capital',
      growth: lead.growth || '25%',
      margin: lead.margin || '18%',
      retention: lead.retention || '110%',
      timing: lead.timing || '6–9 months',
      owner: 'Maya Chen',
      color: 'mint',
      prep: 40,
      contactEmail: lead.email || 'founder@company.com',
      summary: lead.notes || 'Inbound lead qualified by banker. Financial review pending.',
      tags: [lead.sector || 'Technology', 'Inbound Lead'],
      customFieldValues: {}
    };
    setSellers(prev => [newSeller, ...prev]);
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'Qualified -> Seller' } : l));
    setLeadModal(null);
    setToast(`Qualified! ${lead.company} added to Seller Pipeline.`);
  };

  const qualifyLeadAsInvestor = (lead) => {
    const initials = lead.company.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || 'IN';
    const newInvestor = {
      id: `i${Date.now()}`,
      name: lead.company,
      initials,
      type: lead.investorType || 'Growth Equity',
      sectors: lead.sectors || [lead.sector || 'Healthcare IT'],
      stages: lead.stages || ['Growth', 'Series B'],
      check: lead.check || '$15M–$40M',
      geography: lead.geography || 'North America',
      status: 'Active',
      lastTouch: 'Today',
      color: 'teal',
      contactEmail: lead.email || 'partners@fund.com',
      description: lead.notes || 'Inbound investor/LP inquiry qualified into active capital network.',
      customFieldValues: {}
    };
    setInvestors(prev => [newInvestor, ...prev]);
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'Qualified -> Investor' } : l));
    setLeadModal(null);
    setToast(`Qualified! ${lead.company} added to Investor Network.`);
  };

  const requestDisqualifyLead = (lead) => {
    setDisqualifyPrompt({ lead, note: lead.disqualificationReason || '', error: '' });
  };

  const confirmDisqualifyLead = (lead, mandatoryReason) => {
    if (!mandatoryReason || !mandatoryReason.trim()) {
      setToast('Disqualification note is mandatory.');
      return;
    }
    setLeads(prev => prev.map(l => l.id === lead.id ? {
      ...l,
      status: 'Disqualified',
      disqualificationReason: mandatoryReason.trim()
    } : l));
    setDisqualifyPrompt(null);
    setLeadModal(null);
    setToast(`${lead.company} marked as Disqualified.`);
  };

  const restoreLead = (lead) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? {
      ...l,
      status: 'Under Research',
      disqualificationReason: null
    } : l));
    setLeadModal(null);
    setToast(`${lead.company} restored to Under Research.`);
  };

  const handleInitiateDeal = ({ seller, investor, dealSize, leadBanker, stage, notes }) => {
    const newDeal = {
      id: `deal-${Date.now()}`,
      title: `${seller.name} × ${investor.name}`,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerSector: seller.sector,
      sellerRevenue: seller.revenue,
      investorId: investor.id,
      investorName: investor.name,
      investorType: investor.type,
      investorCheck: investor.check,
      dealSize: dealSize || '$45M – $55M Valuation',
      stage: stage || 'Outreach & NDA',
      leadBanker: leadBanker || 'Maya Chen',
      matchScore: getInvestorMatchScore(investor, seller),
      initiatedAt: 'Just now',
      expectedClose: 'Q1 2027',
      notes: notes || `Direct transaction mandate initiated between ${seller.name} and ${investor.name}.`,
      milestones: [
        { name: 'Mutual NDA Executed', done: true, date: 'Today' },
        { name: 'CIM & Financial Model Delivery', done: false, date: 'Pending' },
        { name: 'IOI Evaluation', done: false, date: 'Pending' },
        { name: 'LOI Negotiation', done: false, date: 'Pending' },
        { name: 'Confirmatory Due Diligence', done: false, date: 'Pending' },
        { name: 'Definitive Agreement & Closing', done: false, date: 'Pending' }
      ]
    };

    setOngoingDeals(prev => [newDeal, ...prev]);
    setInitiateDealModal(null);
    setToast(`Deal initiated: ${seller.name} × ${investor.name}. Moved to Ongoing Deals.`);
    setView('ongoing');
  };

  const advanceDealStage = (dealId) => {
    const stageFlow = ['Outreach & NDA', 'IOI Submitted', 'LOI & Exclusivity', 'Confirmatory DD', 'Closing', 'Closed'];
    setOngoingDeals(prev => prev.map(deal => {
      if (deal.id !== dealId) return deal;
      const currentIdx = stageFlow.indexOf(deal.stage);
      const nextIdx = Math.min(stageFlow.length - 1, currentIdx + 1);
      const nextStage = stageFlow[nextIdx];
      if (nextStage === 'Closed') {
        closeOngoingDeal(deal);
      }
      return { ...deal, stage: nextStage };
    }));
    setToast('Deal stage advanced.');
  };

  const closeOngoingDeal = (deal) => {
    const newClosed = {
      id: `cd-${Date.now()}`,
      company: deal.sellerName,
      buyer: deal.investorName,
      dealSize: deal.dealSize,
      multiple: 'Market standard',
      closeDate: 'Just now',
      status: 'In Integration',
      integrationProgress: 20,
      dealLead: deal.leadBanker,
      sector: deal.sellerSector,
      type: 'Completed Transaction',
      summary: `Transaction concluded between ${deal.sellerName} and ${deal.investorName}.`,
      escrowEndDate: '1 Year Post-Close',
      escrowAmount: '10% Indemnity Escrow',
      tsaPeriod: '6 Months',
      tasks: [
        { id: 'c1', title: 'Confirm final funds flow & escrow wire receipts', when: 'Closing Day', done: true, person: deal.leadBanker },
        { id: 'c2', title: 'Decommission virtual data room & archive diligence records', when: 'Within 5 Days', done: false, person: 'Operations' },
        { id: 'c3', title: 'Executive retention agreement vesting confirmation', when: '30 Days', done: false, person: 'Senior Banker' },
        { id: 'c4', title: 'Transition Services Agreement (TSA) monthly SLA review', when: '60 Days', done: false, person: 'Deal Team' },
        { id: 'c5', title: 'Working capital true-up adjustment statement settlement', when: '90 Days', done: false, person: 'Finance Lead' }
      ],
      events: [
        { id: 'e1', month: 'NOV', day: '15', title: '30-Day Operational Review & Post-Close Sync', assignee: deal.leadBanker, tone: 'amber', status: 'Upcoming', description: 'Review transition milestones and banking relationships.' },
        { id: 'e2', month: 'DEC', day: '15', title: '60-Day Working Capital & TSA Milestone Check', assignee: deal.leadBanker, tone: 'blue', status: 'Scheduled', description: 'Reconcile net working capital true-up.' }
      ]
    };
    setClosedDeals(prev => [newClosed, ...prev]);
    setOngoingDeals(prev => prev.map(d => d.id === deal.id ? { ...d, stage: 'Closed' } : d));
    setToast(`${deal.title} marked as Closed and transferred to After the Deal portfolio!`);
  };

  const saveLeadResearch = (updatedLead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    setLeadModal(null);
    setToast('Lead research and field data saved.');
  };

  const addSimulatedLead = (form) => {
    const newLead = {
      id: `ld${Date.now()}`,
      company: form.company,
      name: form.name,
      email: form.email,
      phone: form.phone || '+1 (555) 019-2834',
      sourceForm: form.sourceForm || 'Website Sell-Side Form',
      submittedAt: 'Just now',
      suspectedType: form.suspectedType || 'Seller',
      status: 'New Submission',
      notes: form.notes || 'Inbound inquiry submitted via online portal.',
      sector: form.sector || 'Healthcare IT',
      location: form.location || 'Austin, TX',
      revenue: form.revenue || '$20M',
      growth: form.growth || '25%',
      margin: form.margin || '18%',
      retention: '110%',
      goal: form.goal || 'Evaluate strategic options',
      timing: '6–12 months',
      tags: [form.sector || 'Software', 'New submission'],
      researchNotes: 'Awaiting initial review and field enrichment.'
    };
    setLeads(prev => [newLead, ...prev]);
    setModal(null);
    setToast('New inbound form submission simulated!');
  };

  /* Custom Field Handlers */
  const addCustomField = (newField) => {
    if (newField.profileType === 'seller') {
      setSellerCustomFields(prev => [...prev, newField]);
      if (detailProfile?.type === 'seller' && newField.initialValue) {
        updateCustomFieldValue('seller', detailProfile.record.id, newField.id, newField.initialValue);
      }
    } else {
      setInvestorCustomFields(prev => [...prev, newField]);
      if (detailProfile?.type === 'investor' && newField.initialValue) {
        updateCustomFieldValue('investor', detailProfile.record.id, newField.id, newField.initialValue);
      }
    }
    setCustomFieldModal(null);
    setToast(`Custom field '${newField.label}' created across all ${newField.profileType} profiles.`);
  };

  const updateCustomFieldValue = (profileType, recordId, fieldId, value) => {
    if (profileType === 'seller') {
      setSellers(prev => prev.map(s => {
        if (s.id !== recordId) return s;
        const vals = { ...(s.customFieldValues || {}), [fieldId]: value };
        return { ...s, customFieldValues: vals };
      }));
      if (detailProfile?.type === 'seller' && detailProfile.record.id === recordId) {
        setDetailProfile(prev => ({
          ...prev,
          record: {
            ...prev.record,
            customFieldValues: { ...(prev.record.customFieldValues || {}), [fieldId]: value }
          }
        }));
      }
    } else {
      setInvestors(prev => prev.map(i => {
        if (i.id !== recordId) return i;
        const vals = { ...(i.customFieldValues || {}), [fieldId]: value };
        return { ...i, customFieldValues: vals };
      }));
      if (detailProfile?.type === 'investor' && detailProfile.record.id === recordId) {
        setDetailProfile(prev => ({
          ...prev,
          record: {
            ...prev.record,
            customFieldValues: { ...(prev.record.customFieldValues || {}), [fieldId]: value }
          }
        }));
      }
    }
  };

  const pageAction = () => {
    if (view === 'leads') setModal({ type:'inbound-lead' });
    else if (view === 'sellers' || view === 'overview' || view === 'readiness' || view === 'matching') setModal({ type:'seller' });
    else if (view === 'investors') setModal({ type:'investor' });
    else if (view === 'ongoing') setInitiateDealModal({ seller: sellers[0], investor: investors[0], dealSize: '', leadBanker: 'Maya Chen', stage: 'Outreach & NDA', notes: '' });
    else if (view === 'blind') setModal({ type:'terms' });
    else if (view === 'tasks' || view === 'afterclose') setModal({ type:'task' });
    else if (view === 'investments') setToast('Investment opportunity entry is a separate demo placeholder.');
  };

  return <div className="app-shell">
    {mobileNavOpen && <div className="sidebar-backdrop" onClick={() => setMobileNavOpen(false)} />}
    <aside className={`sidebar ${mobileNavOpen ? 'mobile-open' : ''}`}>
      <div className="brand-row">
        <div className="brand-mark"><span className="brand-glyph">Z</span></div>
        <div className="brand-name">
          <strong>Zeon DealBridge</strong>
          <span className="brand-sub">Investment Banking Workspace</span>
        </div>
        <button className="mobile-close-btn" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X size={17} /></button>
      </div>
      <div className="workspace-switcher">
        <div className="workspace-avatar">ZD</div>
        <div className="workspace-info">
          <strong>DealBridge Workspace</strong>
          <span>Investment banking</span>
        </div>
        <ChevronDown size={15} className="workspace-chevron" />
      </div>
      <div className="nav-scroll">
        {navGroups.map(group => <div className="nav-group" key={group.label}>
          <p className="nav-label">{group.label}</p>
          {group.items.map(item => {
            const Icon = item.icon;
            return <button key={item.id} className={`nav-item ${view===item.id?'active':''}`} onClick={() => { setDetailProfile(null); setView(item.id); setSearchText(''); setMobileNavOpen(false); }}>
              <Icon size={17} strokeWidth={1.9} />
              <span>{item.label}</span>
              {item.id==='leads' && <small>{leads.filter(l => !l.status.startsWith('Qualified') && l.status !== 'Archived').length}</small>}
              {item.id==='sellers' && <small>{sellers.length}</small>}
              {item.id==='investors' && <small>{investors.length}</small>}
              {item.id==='ongoing' && <small>{ongoingDeals.length}</small>}
            </button>;
          })}
        </div>)}
        <div className="nav-group">
          <p className="nav-label">INSIGHTS</p>
          <button className={`nav-item ${view==='tasks'?'active':''}`} onClick={() => { setDetailProfile(null); setView('tasks'); setMobileNavOpen(false); }}><ListChecks size={17}/><span>Tasks & follow-ups</span><small>{tasks.filter(t=>!t.done).length}</small></button>
          <button className="nav-item" onClick={() => { setEmailConfigModal(true); setMobileNavOpen(false); }}><Mail size={17}/><span>Mail settings</span></button>
          <button className="nav-item" onClick={() => { setToast('System preferences are currently active.'); setMobileNavOpen(false); }}><Settings size={17}/><span>Settings</span></button>
        </div>
      </div>
      <div className="sidebar-bottom">
        <div className="privacy-mini"><ShieldCheck size={16}/><div><strong>Private by default</strong><span>Confidential workflow</span></div></div>
        <div className="profile-row"><Avatar initials="MC" color="mint"/><div><strong>Maya Chen</strong><span>Managing Director</span></div><MoreHorizontal size={17}/></div>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <div className="topbar-left">
          <button className="mobile-hamburger-btn" onClick={() => setMobileNavOpen(true)} aria-label="Open mobile menu">
            <Menu size={18} />
          </button>
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14}/><strong>{activeTitle[0]}</strong></div>
        </div>
        <div className="topbar-right">
          <div className="global-search"><Search size={16}/><input aria-label="Search workspace" placeholder="Search companies, investors, leads, tasks…" value={searchText} onChange={e=>setSearchText(e.target.value)} /><kbd>⌘ K</kbd></div>
          <button className="top-icon" onClick={()=>setToast('All notification alerts are clear.')} aria-label="Notifications"><Bell size={18}/><i/></button>
          <button className="avatar-trigger" onClick={()=>setEmailConfigModal(true)}><Avatar initials="MC" color="mint" size="sm"/><ChevronDown size={14}/></button>
        </div>
      </header>

      <div className="main-content">
        {detailProfile ? <DetailProfilePage
          key={`${detailProfile.type}-${detailProfile.record.id}`}
          profile={detailProfile}
          sellers={sellers}
          investors={investors}
          sellerCustomFields={sellerCustomFields}
          investorCustomFields={investorCustomFields}
          onAddCustomField={() => setCustomFieldModal({ profileType: detailProfile.type })}
          onUpdateCustomField={(fieldId, val) => updateCustomFieldValue(detailProfile.type, detailProfile.record.id, fieldId, val)}
          connectedEmail={connectedEmail}
          onOpenEmailConfig={() => setEmailConfigModal(true)}
          onPreviewDoc={(doc) => setDocPreviewModal({ doc, recordName: detailProfile.record.name })}
          backLabel={viewInfo[view]?.[0]||'workspace'}
          onBack={()=>setDetailProfile(null)}
          onNavigateProfile={openDetailProfile}
          setToast={setToast}
        /> : <>
          <div className="page-title-row">
            <div>
              <div className="page-eyebrow"><span className="live-dot"/>ZEON DEALBRIDGE <span className="demo-tag">Investment Workspace</span></div>
              <h1>{activeTitle[0]}</h1>
              <p>{activeTitle[1]}</p>
            </div>
            <div className="title-actions">
              <button className="button button-quiet" onClick={()=>setToast('Report export generated (demo).')}><FileText size={16}/> Export</button>
              <button className="button button-primary" onClick={pageAction}><Plus size={17}/> {view==='leads'?'New form submission':view==='investors'?'Add investor':view==='ongoing'?'Initiate deal':view==='blind'?'Record terms':view==='tasks'?'Add task':view==='afterclose'?'Log post-close task':view==='investments'?'Add opportunity':'New seller lead'}</button>
            </div>
          </div>

          {view==='overview' && <Overview
            sellers={sellers}
            investors={investors}
            tasks={tasks}
            leads={leads}
            ongoingDeals={ongoingDeals}
            setView={setView}
            toggleTask={toggleTask}
            onOpenSeller={openSeller}
            onOpenInvestor={openInvestor}
            openDetailProfile={openDetailProfile}
            onOpenLead={(l) => setLeadModal({ lead: l, mode: 'research' })}
            setModal={setModal}
            onUpdateSellerStage={updateSellerStage}
          />}
          {view==='leads' && <LeadsView
            leads={leads}
            onOpenLead={(l) => setLeadModal({ lead: l, mode: 'research' })}
            onQualifySeller={qualifyLeadAsSeller}
            onQualifyInvestor={qualifyLeadAsInvestor}
            onRequestDisqualify={requestDisqualifyLead}
            onRestoreLead={restoreLead}
            onNewLeadModal={() => setModal({ type:'inbound-lead' })}
            searchText={searchText}
            setSearchText={setSearchText}
            onUpdateStatus={updateLeadStatus}
          />}
          {view==='sellers' && <SellerPipeline sellers={filteredSellers} allSellers={sellers} searchText={searchText} setSearchText={setSearchText} stageFilter={stageFilter} setStageFilter={setStageFilter} sectorFilter={sectorFilter} setSectorFilter={setSectorFilter} onOpenSeller={openSeller} setModal={setModal} onUpdateStage={updateSellerStage} />}
          {view==='investors' && <InvestorNetwork investors={investors} sellers={sellers} searchText={searchText} setSearchText={setSearchText} onOpenInvestor={openInvestor} setModal={setModal} onUpdateStatus={updateInvestorStatus} />}
          {view==='matching' && <MatchingView
            sellers={sellers}
            investors={investors}
            selectedSellerId={selectedSellerId}
            setSelectedSellerId={setSelectedSellerId}
            setSelectedInvestorId={setSelectedInvestorId}
            setView={setView}
            setToast={setToast}
            onInitiateDeal={(seller, investor, score) => setInitiateDealModal({ seller, investor, score, dealSize: '', leadBanker: 'Maya Chen', stage: 'Outreach & NDA', notes: '' })}
          />}
          {view==='ongoing' && <OngoingDealsView
            deals={ongoingDeals}
            setOngoingDeals={setOngoingDeals}
            sellers={sellers}
            investors={investors}
            onAdvanceStage={advanceDealStage}
            onCloseDeal={closeOngoingDeal}
            onOpenInitiate={() => setInitiateDealModal({ seller: sellers[0], investor: investors[0], dealSize: '', leadBanker: 'Maya Chen', stage: 'Outreach & NDA', notes: '' })}
            onViewAfterClose={() => setView('afterclose')}
            setToast={setToast}
            onUpdateStage={updateDealStage}
          />}
          {view==='readiness' && <ReadinessView sellers={sellers} selectedSellerId={selectedSellerId} setSelectedSellerId={setSelectedSellerId} readyState={readyState} toggleReady={toggleReady} setToast={setToast} />}
          {view==='blind' && <BlindView sellers={sellers} selectedSellerId={selectedSellerId} setSelectedSellerId={setSelectedSellerId} terms={terms} blindApproved={blindApproved} setBlindApproved={setBlindApproved} outreachApproved={outreachApproved} setOutreachApproved={setOutreachApproved} blindSent={blindSent} handleSendBlind={handleSendBlind} ndaVerified={ndaVerified} setNdaVerified={setNdaVerified} identityApproved={identityApproved} setIdentityApproved={setIdentityApproved} identityDisclosureAuthorized={identityDisclosureAuthorized} setIdentityDisclosureAuthorized={setIdentityDisclosureAuthorized} setModal={setModal} setToast={setToast} />}
          {view==='investments' && <OwnInvestments setToast={setToast} />}
          {view==='afterclose' && <AfterClose closedDeals={closedDeals} setClosedDeals={setClosedDeals} sellers={sellers} tasks={tasks} toggleTask={toggleTask} setToast={setToast} />}
          {view==='tasks' && <TasksView tasks={tasks} toggleTask={toggleTask} setModal={setModal} onUpdateStatus={updateTaskStatus} />}
        </>}
      </div>
    </main>

    {drawerSeller && <SellerDrawer seller={drawerSeller} investors={investors} onClose={()=>setDrawerSeller(null)} onStage={stage=>updateStage(drawerSeller.id,stage)} onOpenInvestor={openInvestor} onDetailProfile={openDetailProfile} setView={setView} />}
    {drawerInvestor && <InvestorDrawer investor={drawerInvestor} sellers={sellers} selectedSellerId={selectedSellerId} setSelectedSellerId={setSelectedSellerId} onClose={()=>setDrawerInvestor(null)} onOpenSeller={openSeller} onDetailProfile={openDetailProfile} setView={setView} />}
    
    {leadModal && <LeadResearchModal
      lead={leadModal.lead}
      onClose={()=>setLeadModal(null)}
      onSaveResearch={saveLeadResearch}
      onQualifySeller={qualifyLeadAsSeller}
      onQualifyInvestor={qualifyLeadAsInvestor}
      onRequestDisqualify={requestDisqualifyLead}
      onRestore={restoreLead}
    />}

    {disqualifyPrompt && <DisqualifyModal
      lead={disqualifyPrompt.lead}
      onClose={()=>setDisqualifyPrompt(null)}
      onConfirm={confirmDisqualifyLead}
    />}

    {initiateDealModal && <InitiateDealModal
      modal={initiateDealModal}
      sellers={sellers}
      investors={investors}
      onClose={()=>setInitiateDealModal(null)}
      onConfirm={handleInitiateDeal}
    />}

    {customFieldModal && <CustomFieldModal
      profileType={customFieldModal.profileType}
      sections={customFieldModal.profileType === 'seller' ? sellerSections : investorSections}
      onClose={()=>setCustomFieldModal(null)}
      onAdd={addCustomField}
    />}

    {emailConfigModal && <EmailConfigModal
      account={connectedEmail}
      onClose={()=>setEmailConfigModal(false)}
      onSave={(acc) => { setConnectedEmail(acc); setEmailConfigModal(false); setToast('Mailbox integration settings updated.'); }}
    />}

    {docPreviewModal && <DocumentPreviewModal
      doc={docPreviewModal.doc}
      recordName={docPreviewModal.recordName}
      onClose={()=>setDocPreviewModal(null)}
    />}

    {modal && <Modal
      modal={modal}
      onClose={()=>setModal(null)}
      onAddSeller={addSeller}
      onAddInvestor={addInvestor}
      onAddTerm={addTerm}
      onAddTask={addTask}
      onAddLead={addSimulatedLead}
    />}

    {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}<button onClick={()=>setToast('')}><X size={14}/></button></div>}
  </div>;
}

/* ==========================================================================
   DISQUALIFY LEAD MODAL (MANDATORY RATIONALE)
   ========================================================================== */

function DisqualifyModal({ lead, onClose, onConfirm }) {
  const [note, setNote] = useState(lead?.disqualificationReason || '');
  const [error, setError] = useState('');

  const presets = [
    'Below $10M ARR advisory threshold',
    'Outside institutional mandate / high risk asset',
    'Customer concentration (>50% single account)',
    'Unaudited financials / insufficient record transparency',
    'Unrealistic valuation expectation (>12x ARR with low growth)',
    'Founder unresponsive to screening inquiries'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) {
      setError('A disqualification note is strictly mandatory before archiving this lead.');
      return;
    }
    onConfirm(lead, note.trim());
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal-card" style={{ width: 'min(580px, 95vw)' }} onClick={e => e.stopPropagation()}>
        <div className="modal-heading">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="disqualify-icon-bubble" style={{ background: '#fef2f2', padding: 8, borderRadius: 8 }}>
              <Ban size={20} color="#dc2626"/>
            </div>
            <div>
              <span className="control-label" style={{ color: '#dc2626' }}>INTAKE GOVERNANCE · MANDATORY RATIONALE</span>
              <h2 style={{ margin: 0, fontSize: 18 }}>Disqualify Lead: {lead?.company}</h2>
            </div>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18}/></button>
        </div>

        <form onSubmit={handleSubmit}>
          <p style={{ margin: '8px 0 14px', fontSize: 13, color: '#576f84', lineHeight: 1.5 }}>
            Zeon advisory standards require a documented disqualification reason for compliance and audit logs. Select a quick reason or provide specific details below.
          </p>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              Quick rationale presets:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {presets.map(p => (
                <button
                  key={p}
                  type="button"
                  className="preset-chip"
                  onClick={() => {
                    setNote(prev => prev ? `${prev} · ${p}` : p);
                    setError('');
                  }}
                >
                  + {p}
                </button>
              ))}
            </div>
          </div>

          <label className="field-required-label">
            Disqualification Note / Advisory Rationale <span style={{ color: '#dc2626', fontWeight: 700 }}>* (Mandatory)</span>
            <textarea
              rows={4}
              required
              style={{
                width: '100%',
                padding: 10,
                border: error ? '1.5px solid #dc2626' : '1px solid #cbd5e1',
                borderRadius: 7,
                fontSize: 13,
                fontFamily: 'inherit',
                marginTop: 5,
                background: error ? '#fffdfd' : '#ffffff'
              }}
              value={note}
              onChange={e => {
                setNote(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="Enter the specific reason for disqualifying this lead (mandatory)..."
            />
          </label>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#dc2626', fontSize: 12.5, fontWeight: 600, marginTop: 6 }}>
              <AlertCircle size={15}/> {error}
            </div>
          )}

          <div className="modal-actions" style={{ marginTop: 20 }}>
            <button type="button" className="button button-quiet" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="button button-danger"
              disabled={!note.trim()}
              style={{ opacity: !note.trim() ? 0.6 : 1 }}
            >
              <Ban size={15}/> Confirm Disqualification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==========================================================================
   INBOUND LEADS VIEW & RESEARCH COMPONENT
   ========================================================================== */

function LeadsView({ leads, onOpenLead, onQualifySeller, onQualifyInvestor, onRequestDisqualify, onRestoreLead, onNewLeadModal, searchText, setSearchText, onUpdateStatus }) {
  const [viewMode, setViewMode] = useState('board');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [draggedLeadId, setDraggedLeadId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const pendingCount = leads.filter(l => l.status === 'New Submission').length;
  const researchCount = leads.filter(l => l.status === 'Under Research').length;
  const qualifiedCount = leads.filter(l => l.status.startsWith('Qualified')).length;
  const disqualifiedCount = leads.filter(l => l.status === 'Disqualified').length;
  const activeCount = leads.filter(l => l.status !== 'Disqualified').length;

  const leadStages = [
    { id: 'New Submission', label: 'New Submission', dot: 'slate' },
    { id: 'Under Research', label: 'Under Research', dot: 'blue' },
    { id: 'Qualified', label: 'Qualified', dot: 'emerald' },
    { id: 'Disqualified', label: 'Disqualified', dot: 'rose' }
  ];

  const filtered = useMemo(() => leads.filter(l => {
    const q = searchText.toLowerCase();
    const matchSearch = !q || [l.company, l.name, l.email, l.sector, l.notes, l.sourceForm, l.disqualificationReason].filter(Boolean).join(' ').toLowerCase().includes(q);
    const matchStatus = viewMode === 'board'
      ? true
      : statusFilter === 'All'
        ? l.status !== 'Disqualified'
        : statusFilter === 'Qualified'
          ? l.status.startsWith('Qualified')
          : statusFilter === 'Disqualified'
            ? l.status === 'Disqualified'
            : l.status === statusFilter;
    const matchType = typeFilter === 'All' || l.suspectedType === typeFilter;
    return matchSearch && matchStatus && matchType;
  }), [leads, searchText, statusFilter, typeFilter, viewMode]);

  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData('text/plain', leadId);
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    if (dragOverStage !== stageId) setDragOverStage(stageId);
  };

  const handleDragLeave = (e, stageId) => {
    if (dragOverStage === stageId) setDragOverStage(null);
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    setDragOverStage(null);
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId && onUpdateStatus) {
      onUpdateStatus(leadId, stageId);
    }
    setDraggedLeadId(null);
  };

  return <div className="view-stack">
    {/* Attio View Controls Toolbar */}
    <div className="attio-view-bar">
      <div className="attio-view-bar-left">
        <div className="attio-view-title">
          <Inbox size={16} />
          <span>Inbound Leads</span>
          <span className="attio-view-count-badge">{filtered.length} submissions</span>
        </div>

        <div className="attio-view-switcher">
          <button
            type="button"
            className={`attio-view-btn ${viewMode === 'board' ? 'active' : ''}`}
            onClick={() => setViewMode('board')}
          >
            <Kanban size={13} />
            <span>Board</span>
          </button>
          <button
            type="button"
            className={`attio-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={13} />
            <span>Grid</span>
          </button>
        </div>
      </div>

      <div className="attio-view-bar-right">
        <div className="attio-search-box">
          <Search size={14} />
          <input
            placeholder="Search leads, companies, submitters..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <kbd>/</kbd>
        </div>

        <CustomSelect
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: 'All', label: 'All types' },
            { value: 'Seller', label: 'Seller prospects' },
            { value: 'Investor', label: 'Investor prospects' }
          ]}
          placeholder="All types"
        />

        <button className="button button-primary button-small" onClick={onNewLeadModal}>
          <Plus size={15} /> Simulate submission
        </button>
      </div>
    </div>

    {viewMode === 'board' ? (
      <div className="attio-kanban-board">
        {leadStages.map(st => {
          const colLeads = filtered.filter(l => st.id === 'Qualified' ? l.status.startsWith('Qualified') : l.status === st.id);
          const isOver = dragOverStage === st.id;

          return (
            <div
              key={st.id}
              className={`attio-kanban-column ${isOver ? 'drag-over' : ''}`}
              onDragOver={e => handleDragOver(e, st.id)}
              onDragLeave={e => handleDragLeave(e, st.id)}
              onDrop={e => handleDrop(e, st.id)}
            >
              <div className="attio-column-header">
                <div className="attio-column-title-wrap">
                  <span className={`attio-stage-dot ${st.dot}`} />
                  <span className="attio-column-name">{st.label}</span>
                  <span className="attio-column-count">{colLeads.length}</span>
                </div>
                <button
                  type="button"
                  className="attio-column-add-btn"
                  title="Simulate new submission"
                  onClick={onNewLeadModal}
                >
                  <Plus size={13} />
                </button>
              </div>

              <div className="attio-cards-list">
                {colLeads.map(lead => {
                  const isQualified = lead.status.startsWith('Qualified');
                  const isDisqualified = lead.status === 'Disqualified';
                  const isSeller = lead.suspectedType === 'Seller';

                  return (
                    <div
                      key={lead.id}
                      className={`attio-card ${draggedLeadId === lead.id ? 'dragging' : ''}`}
                      draggable={true}
                      onDragStart={e => handleDragStart(e, lead.id)}
                      onClick={() => onOpenLead(lead)}
                    >
                      <div className="attio-card-header">
                        <div className="attio-card-title-group">
                          <CompanyLogo name={lead.company} initials={lead.company.slice(0, 2).toUpperCase()} size="sm" />
                          <div className="attio-card-title">{lead.company}</div>
                        </div>
                        <Badge tone={isDisqualified ? 'red' : isQualified ? 'green' : lead.status === 'Under Research' ? 'blue' : 'amber'}>
                          {lead.status}
                        </Badge>
                      </div>

                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {lead.name} · {lead.email}
                      </div>

                      {lead.notes && <p className="attio-card-desc">"{lead.notes}"</p>}

                      <div className="attio-card-pills">
                        <span className={`attio-pill ${isSeller ? 'attio-pill-rev' : 'attio-pill-fit'}`}>
                          {lead.suspectedType} Prospect
                        </span>
                        {lead.sector && (
                          <span className="attio-pill attio-pill-sector">
                            {lead.sector}
                          </span>
                        )}
                        {(lead.revenue || lead.check) && (
                          <span className="attio-pill">
                            <CircleDollarSign size={11} /> {lead.revenue || lead.check}
                          </span>
                        )}
                      </div>

                      <div className="attio-lead-actions" onClick={e => e.stopPropagation()}>
                        {!isQualified && !isDisqualified && (
                          <>
                            <button
                              type="button"
                              className="qualify-seller"
                              title="Qualify as Seller"
                              onClick={() => onQualifySeller(lead)}
                            >
                              <Building2 size={12} /> + Seller
                            </button>
                            <button
                              type="button"
                              title="Qualify as Investor"
                              onClick={() => onQualifyInvestor(lead)}
                            >
                              <UsersRound size={12} /> + Investor
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          title="Research lead"
                          onClick={() => onOpenLead(lead)}
                        >
                          <SearchCheck size={12} /> Research
                        </button>
                      </div>
                    </div>
                  );
                })}

                {colLeads.length === 0 && (
                  <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                    No leads in {st.label}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="attio-column-bottom-add"
                onClick={onNewLeadModal}
              >
                <Plus size={13} /> Add submission
              </button>
            </div>
          );
        })}
      </div>
    ) : (
      <section className="card full-card">
        <div className="pipeline-toolbar">
          <div className="segmented">
            {[
              { id: 'All', label: 'All Active', count: activeCount },
              { id: 'New Submission', label: 'New Submission', count: pendingCount },
              { id: 'Under Research', label: 'Under Research', count: researchCount },
              { id: 'Qualified', label: 'Qualified', count: qualifiedCount },
              { id: 'Disqualified', label: 'Disqualified', count: disqualifiedCount }
            ].map(tab => (
              <button
                key={tab.id}
                className={`${statusFilter === tab.id ? 'selected' : ''} ${tab.id === 'Disqualified' ? 'tab-disqualified' : ''}`}
                onClick={() => setStatusFilter(tab.id)}
              >
                {tab.label}
                <span>{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {filtered.length ? (
          <div className="lead-card-grid">
            {filtered.map(lead => {
              const isQualified = lead.status.startsWith('Qualified');
              const isDisqualified = lead.status === 'Disqualified';
              const isSellerProspect = lead.suspectedType === 'Seller';
              const statusTone = isDisqualified
                ? 'red'
                : isQualified
                  ? 'green'
                  : lead.status === 'Under Research'
                    ? 'blue'
                    : 'amber';

              return <div className={`lead-item-card ${isDisqualified ? 'is-disqualified' : ''}`} key={lead.id}>
                <div className="lead-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CompanyLogo name={lead.company} initials={lead.company.slice(0,2).toUpperCase()} size="md" />
                    <div>
                      <h3 style={{ margin: 0, fontSize: 14.5, color: '#1f3448' }}>{lead.company}</h3>
                      <span style={{ fontSize: 12, color: '#687b8d' }}>{lead.name} · {lead.email}</span>
                    </div>
                  </div>
                  <Badge tone={statusTone}>{lead.status}</Badge>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '5px 0' }}>
                  <span className="lead-source-badge"><FileText size={12}/> {lead.sourceForm}</span>
                  <span style={{ fontSize: 11.5, color: '#7a8c9b' }}>• {lead.submittedAt}</span>
                </div>

                <div className="lead-submission-snippet">
                  "{lead.notes}"
                </div>

                {isDisqualified && lead.disqualificationReason && (
                  <div className="lead-disqualified-notice">
                    <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <strong>Disqualification reason:</strong> {lead.disqualificationReason}
                    </div>
                  </div>
                )}

                <div className="lead-meta-row">
                  <div className="lead-meta-item">
                    <span>Sector / Domain</span>
                    <strong>{lead.sector || 'To investigate'}</strong>
                  </div>
                  <div className="lead-meta-item">
                    <span>{isSellerProspect ? 'Reported Revenue' : 'Target Check Size'}</span>
                    <strong>{isSellerProspect ? (lead.revenue || 'Not specified') : (lead.check || 'Not specified')}</strong>
                  </div>
                  <div className="lead-meta-item">
                    <span>Classification</span>
                    <strong>{lead.suspectedType} Prospect</strong>
                  </div>
                  <div className="lead-meta-item">
                    <span>Location</span>
                    <strong>{lead.location || lead.geography || 'United States'}</strong>
                  </div>
                </div>

                <div className="lead-card-footer">
                  <button className="button button-secondary button-small lead-action-full" onClick={()=>onOpenLead(lead)}>
                    <SearchCheck size={14}/> Research & populate
                  </button>
                  <div className="lead-qualification-buttons">
                    {!isQualified && !isDisqualified && (
                      <>
                        <button className="button button-quiet button-small lead-qual-btn" title="Qualify as Seller" onClick={()=>onQualifySeller(lead)}>
                          <Building2 size={13}/> Seller
                        </button>
                        <button className="button button-quiet button-small lead-qual-btn" title="Qualify as Investor" onClick={()=>onQualifyInvestor(lead)}>
                          <UsersRound size={13}/> Investor
                        </button>
                        <button
                          className="button button-danger-quiet button-small lead-qual-btn lead-btn-disqualify"
                          title="Disqualify this lead"
                          onClick={()=>onRequestDisqualify(lead)}
                        >
                          <Ban size={13}/> Disqualify
                        </button>
                      </>
                    )}
                    {isQualified && (
                      <span className="lead-converted-tag">
                        <CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                        Converted
                      </span>
                    )}
                    {isDisqualified && (
                      <button
                        className="button button-quiet button-small lead-restore-btn"
                        title="Restore lead to Under Research"
                        onClick={()=>onRestoreLead(lead)}
                      >
                        <RotateCcw size={13}/> Restore lead
                      </button>
                    )}
                  </div>
                </div>
              </div>;
            })}
          </div>
        ) : (
          <EmptyState title="No inbound form leads found" message={statusFilter === 'Disqualified' ? "No leads are currently disqualified." : "Try adjusting your status or search terms."} />
        )}
      </section>
    )}
  </div>;
}

function LeadResearchModal({ lead, onClose, onSaveResearch, onQualifySeller, onQualifyInvestor, onRequestDisqualify, onRestore }) {
  const [formData, setFormData] = useState({ ...lead });
  const [validationError, setValidationError] = useState('');
  const update = (key, val) => {
    setFormData(old => ({ ...old, [key]: val }));
    if (validationError) setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.status === 'Disqualified' && !formData.disqualificationReason?.trim()) {
      setValidationError('A disqualification note is strictly mandatory before archiving a lead.');
      return;
    }
    onSaveResearch(formData);
  };

  const isSeller = formData.suspectedType === 'Seller';
  const isDisqualified = formData.status === 'Disqualified';

  return <div className="modal-scrim" onClick={onClose}><div className="modal-card" style={{ width: 'min(760px, 95vw)' }} onClick={e=>e.stopPropagation()}>
    <div className="modal-heading">
      <div>
        <span className="control-label">INBOUND LEAD TRIAGE & FIELD ENRICHMENT</span>
        <h2>Research & Populate: {lead.company}</h2>
        <span style={{ fontSize: 12.5, color: '#6d8194' }}>Enrich missing financial and mandate data before qualifying into deals.</span>
      </div>
      <button className="icon-button" onClick={onClose}><X size={18}/></button>
    </div>

    <form onSubmit={handleSubmit}>
      <div className="lead-research-layout">
        <div className="lead-inbound-raw">
          <h4>Original Inbound Submission</h4>
          <div><span style={{ fontSize: 11.5, color: '#728596' }}>Contact Name:</span> <strong style={{ fontSize: 13, color: '#273c50', display: 'block' }}>{lead.name}</strong></div>
          <div><span style={{ fontSize: 11.5, color: '#728596' }}>Contact Email & Phone:</span> <strong style={{ fontSize: 13, color: '#273c50', display: 'block' }}>{lead.email} · {lead.phone}</strong></div>
          <div><span style={{ fontSize: 11.5, color: '#728596' }}>Form Origin:</span> <strong style={{ fontSize: 13, color: '#273c50', display: 'block' }}>{lead.sourceForm}</strong></div>
          <div><span style={{ fontSize: 11.5, color: '#728596' }}>Submitted Timestamp:</span> <strong style={{ fontSize: 13, color: '#273c50', display: 'block' }}>{lead.submittedAt}</strong></div>
          <div style={{ marginTop: 6 }}>
            <span style={{ fontSize: 11.5, color: '#728596' }}>Original Inbound Message:</span>
            <div style={{ background: '#ffffff', border: '1px solid #dce4eb', borderRadius: 7, padding: 11, fontSize: 12.5, color: '#33485b', lineHeight: 1.5, marginTop: 4 }}>
              {lead.notes}
            </div>
          </div>
        </div>

        <div className="lead-research-editor">
          <div className="form-two">
            <label>Suspected classification
              <select value={formData.suspectedType} onChange={e=>update('suspectedType', e.target.value)}>
                <option value="Seller">Seller Prospect (Company seeking Sale/Raise)</option>
                <option value="Investor">Investor Prospect (Fund/LP/Buyer)</option>
              </select>
            </label>
            <label>Lead status
              <select value={formData.status} onChange={e=>update('status', e.target.value)}>
                <option value="New Submission">New Submission</option>
                <option value="Under Research">Under Research</option>
                <option value="Qualified -> Seller">Qualified -> Seller</option>
                <option value="Qualified -> Investor">Qualified -> Investor</option>
                <option value="Disqualified">Disqualified</option>
              </select>
            </label>
          </div>

          {(formData.status === 'Disqualified' || isDisqualified) && (
            <div style={{ marginTop: 2, background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 8, padding: 10 }}>
              <label style={{ color: '#c53030', fontWeight: 650 }}>Disqualification rationale & reason (Mandatory)*
                <input
                  style={{ borderColor: validationError ? '#e53e3e' : '#cbd5e1' }}
                  value={formData.disqualificationReason || ''}
                  placeholder="e.g. Non-fit: revenue under $10M threshold, regulatory concerns, or lack of audited records"
                  onChange={e=>update('disqualificationReason', e.target.value)}
                />
              </label>
              {validationError && (
                <span style={{ color: '#e53e3e', fontSize: 12, fontWeight: 600, display: 'block', marginTop: 4 }}>
                  <AlertCircle size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}/>
                  {validationError}
                </span>
              )}
            </div>
          )}

          <div className="form-two">
            <label>Company / Fund name
              <input required value={formData.company} onChange={e=>update('company', e.target.value)} />
            </label>
            <label>Sector / Domain
              <select value={formData.sector || 'Healthcare IT'} onChange={e=>update('sector', e.target.value)}>
                {['Healthcare IT','Financial Technology','Education Technology','Data & Analytics','Commerce Technology','Governance, Risk & Compliance','Other'].map(s=><option key={s}>{s}</option>)}
              </select>
            </label>
          </div>

          {isSeller ? (
            <>
              <div className="form-two">
                <label>Annual revenue / ARR
                  <input value={formData.revenue || ''} placeholder="e.g. $18M" onChange={e=>update('revenue', e.target.value)} />
                </label>
                <label>YoY Growth rate
                  <input value={formData.growth || ''} placeholder="e.g. 28%" onChange={e=>update('growth', e.target.value)} />
                </label>
              </div>
              <div className="form-two">
                <label>Operating margin
                  <input value={formData.margin || ''} placeholder="e.g. 22%" onChange={e=>update('margin', e.target.value)} />
                </label>
                <label>Headquarters location
                  <input value={formData.location || ''} placeholder="City, State" onChange={e=>update('location', e.target.value)} />
                </label>
              </div>
              <label>Owner / Shareholder goal
                <input value={formData.goal || ''} placeholder="Majority buyout, strategic sale, growth recap" onChange={e=>update('goal', e.target.value)} />
              </label>
            </>
          ) : (
            <>
              <div className="form-two">
                <label>Investor fund type
                  <select value={formData.investorType || 'Growth Equity'} onChange={e=>update('investorType', e.target.value)}>
                    {['Growth Equity','Private Equity','Venture Capital','Family Office','Strategic Investor','Credit Provider'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </label>
                <label>Typical investment check size
                  <input value={formData.check || ''} placeholder="e.g. $20M–$50M" onChange={e=>update('check', e.target.value)} />
                </label>
              </div>
              <label>Target geography
                <input value={formData.geography || ''} placeholder="North America, Europe, Global" onChange={e=>update('geography', e.target.value)} />
              </label>
            </>
          )}

          <label>Banker research notes & diligence verification
            <textarea rows="3" value={formData.researchNotes || ''} placeholder="Cap table notes, IP verification, customer concentration findings..." onChange={e=>update('researchNotes', e.target.value)} />
          </label>
        </div>
      </div>

      <div className="qualification-banner">
        <div>
          <strong>{isDisqualified ? 'Disqualified Intake Record' : 'Ready to advance into active pipeline?'}</strong>
          <span>{isDisqualified ? 'This lead is marked as disqualified and filtered under the Disqualified tab.' : 'Marking as qualified automatically instantiates an enriched profile in the respective network.'}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {!isDisqualified ? (
            <>
              <button type="button" className="button button-secondary" onClick={()=>onQualifySeller(formData)}>
                <Building2 size={15}/> Qualify as Seller
              </button>
              <button type="button" className="button button-primary" onClick={()=>onQualifyInvestor(formData)}>
                <UsersRound size={15}/> Qualify as Investor
              </button>
              <button
                type="button"
                className="button button-danger-outline"
                onClick={()=>{
                  onRequestDisqualify(formData);
                }}
              >
                <Ban size={15}/> Disqualify Lead
              </button>
            </>
          ) : (
            <button
              type="button"
              className="button button-secondary"
              onClick={()=>{
                onRestore(formData);
              }}
            >
              <RotateCcw size={15}/> Restore to Active
            </button>
          )}
        </div>
      </div>

      <div className="modal-actions" style={{ marginTop: 14 }}>
        <button type="button" className="button button-quiet" onClick={onClose}>Cancel</button>
        <button type="submit" className="button button-secondary"><Check size={14}/> Save research data</button>
      </div>
    </form>
  </div></div>;
}

/* ==========================================================================
   CUSTOM FIELDS MANAGEMENT MODAL
   ========================================================================== */

function CustomFieldModal({ profileType, sections, onClose, onAdd }) {
  const [label, setLabel] = useState('');
  const [section, setSection] = useState(sections[0] || 'Company Details & Overview');
  const [type, setType] = useState('text');
  const [initialValue, setInitialValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    const newField = {
      id: `cf_${Date.now()}`,
      label: label.trim(),
      section,
      type,
      profileType,
      initialValue: initialValue.trim()
    };
    onAdd(newField);
  };

  return <div className="modal-scrim" onClick={onClose}><div className="modal-card" style={{ width: 480 }} onClick={e=>e.stopPropagation()}>
    <div className="modal-heading">
      <div>
        <span className="control-label">PROFILE EXTENSIBILITY</span>
        <h2>Add Custom Field ({profileType === 'seller' ? 'Seller' : 'Investor'})</h2>
        <span style={{ fontSize: 12.5, color: '#6d8194' }}>This field will automatically appear across all {profileType} profiles.</span>
      </div>
      <button className="icon-button" onClick={onClose}><X size={18}/></button>
    </div>

    <form onSubmit={handleSubmit}>
      <label>Field Name / Label
        <input required value={label} onChange={e=>setLabel(e.target.value)} placeholder="e.g. EBITDA Margin, Target LTV, Core Counsel" />
      </label>

      <label>Target Section (Where will this appear?)
        <select value={section} onChange={e=>setSection(e.target.value)}>
          {sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
        </select>
      </label>

      <div className="form-two">
        <label>Field Data Type
          <select value={type} onChange={e=>setType(e.target.value)}>
            <option value="text">Text / String</option>
            <option value="number">Numeric value</option>
            <option value="currency">Currency ($)</option>
            <option value="percentage">Percentage (%)</option>
          </select>
        </label>
        <label>Initial value for this record (Optional)
          <input value={initialValue} onChange={e=>setInitialValue(e.target.value)} placeholder="e.g. 24%" />
        </label>
      </div>

      <div className="modal-note">
        <Sparkles size={16}/> Once added, this field becomes available on every similar record in the workspace.
      </div>

      <div className="modal-actions">
        <button type="button" className="button button-quiet" onClick={onClose}>Cancel</button>
        <button type="submit" className="button button-primary" disabled={!label.trim()}><Plus size={15}/> Create field</button>
      </div>
    </form>
  </div></div>;
}

/* ==========================================================================
   EMAIL CONFIGURATION & INTEGRATION MODAL
   ========================================================================== */

function EmailConfigModal({ account, onClose, onSave }) {
  const [form, setForm] = useState({ ...account });
  const update = (key, val) => setForm(old => ({ ...old, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return <div className="modal-scrim" onClick={onClose}><div className="modal-card" style={{ width: 500 }} onClick={e=>e.stopPropagation()}>
    <div className="modal-heading">
      <div>
        <span className="control-label">INTEGRATED COMMUNICATIONS</span>
        <h2>Mail Integration Settings</h2>
        <span style={{ fontSize: 12.5, color: '#6d8194' }}>Connect your corporate email to send and sync advisory messages directly.</span>
      </div>
      <button className="icon-button" onClick={onClose}><X size={18}/></button>
    </div>

    <form onSubmit={handleSubmit}>
      <label>Mailbox Provider
        <select value={form.provider} onChange={e=>update('provider', e.target.value)}>
          <option value="Google Workspace">Google Workspace (Gmail Enterprise)</option>
          <option value="Microsoft 365">Microsoft 365 (Exchange Online)</option>
          <option value="Custom IMAP/SMTP">Custom Corporate IMAP/SMTP Server</option>
        </select>
      </label>

      <div className="form-two">
        <label>Sender Display Name
          <input required value={form.name} onChange={e=>update('name', e.target.value)} />
        </label>
        <label>Connected Email Address
          <input required type="email" value={form.email} onChange={e=>update('email', e.target.value)} />
        </label>
      </div>

      <label>Professional Signature
        <textarea rows="3" value={form.signature} onChange={e=>update('signature', e.target.value)} />
      </label>

      <div className="modal-note">
        <ShieldCheck size={16}/> Verified TLS 1.3 encrypted connection. Outbound emails logged to DealBridge activity timeline.
      </div>

      <div className="modal-actions">
        <button type="button" className="button button-quiet" onClick={onClose}>Cancel</button>
        <button type="submit" className="button button-primary"><Check size={14}/> Save integration</button>
      </div>
    </form>
  </div></div>;
}

/* ==========================================================================
   DOCUMENT PREVIEW & ACCESS LIGHTBOX MODAL
   ========================================================================== */

function DocumentPreviewModal({ doc, recordName, onClose }) {
  if (!doc) return null;
  const isImage = (doc.ext || '').match(/(png|jpg|jpeg|webp|svg)/i) || (doc.file || '').match(/\.(png|jpg|jpeg|webp|svg)$/i);

  const handleDownload = () => {
    if (doc.url) {
      const a = document.createElement('a');
      a.href = doc.url;
      a.download = doc.file;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const blob = new Blob([`Zeon DealBridge Sample Document Content for: ${doc.file}\nEntity: ${recordName}\nCategory: ${doc.category}\nSecurity Clearance: Level 2 Strict\nCreated: ${new Date().toISOString()}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return <div className="doc-preview-modal-overlay" onClick={onClose}>
    <div className="doc-preview-container" onClick={e=>e.stopPropagation()}>
      <div className="doc-preview-header">
        <div className="doc-preview-title">
          <FileText size={20} color="#168f8c" />
          <div>
            <h3>{doc.file}</h3>
            <span style={{ fontSize: 12.5, color: '#6d8194' }}>{recordName} · {doc.category}</span>
          </div>
        </div>
        <button className="icon-button" onClick={onClose}><X size={18}/></button>
      </div>

      <div className="doc-preview-body">
        {isImage && doc.url ? (
          <img src={doc.url} alt={doc.file} className="doc-preview-image" />
        ) : (
          <div className="doc-preview-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className={`doc-format-badge doc-badge-${(doc.ext||'pdf').toLowerCase().slice(0,3)}`} style={{ padding: '6px 12px', fontSize: 12 }}>
                {(doc.ext || 'PDF').toUpperCase()}
              </span>
              <div>
                <strong style={{ fontSize: 15, color: '#1a3348', display: 'block' }}>{doc.file}</strong>
                <span style={{ fontSize: 12, color: '#76899a' }}>Verified Document Register Item</span>
              </div>
            </div>

            <div className="doc-preview-card-meta">
              <div><span>Category</span><strong>{doc.category || 'General Dataroom'}</strong></div>
              <div><span>File Size</span><strong>{doc.size || '340 KB'}</strong></div>
              <div><span>Access Control</span><strong>Confidential (Deal Team Only)</strong></div>
              <div><span>Verification Status</span><strong>{doc.status || 'Active'}</strong></div>
            </div>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, fontSize: 12.5, color: '#41576b', lineHeight: 1.55 }}>
              This document is indexed in the Zeon DealBridge data register. You have full read and export permissions.
            </div>
          </div>
        )}
      </div>

      <div className="doc-preview-footer">
        <button type="button" className="button button-quiet" onClick={onClose}>Close preview</button>
        <button type="button" className="button button-primary" onClick={handleDownload}>
          <Download size={15}/> Download / Access document
        </button>
      </div>
    </div>
  </div>;
}

/* ==========================================================================
   DETAIL PROFILE PAGE (WITH CUSTOM FIELDS, MAIL & MULTI-FORMAT DOCS)
   ========================================================================== */

function getDemoCommunications(type, record) {
  if (type === 'seller') return [
    { id:'seller-com-1', channel:'Email (Sent)', title:'Initial meeting confirmation & diligence checklist', when:'Today, 8:45 AM', recipient: record.contactEmail || 'founders@northstarcare.com', body:`Hi ${record.name} team,\n\nThank you for speaking with us earlier. Following up with the preliminary financial model request and diligence guidelines ahead of our valuation review.\n\nBest,\nMaya Chen`, isEmail:true, delivered:true },
    { id:'seller-com-2', channel:'Call note', title:'Advisory consultation logged', when:'Oct 8, 2026', body:`Discussed ${record.goal?.toLowerCase()||'company goals'}, cap table distribution, and estimated timing window. Follow-up remains subject to engagement agreement.`, isEmail:false },
    { id:'seller-com-3', channel:'Email draft', title:'Follow-up draft · pending banker review', when:'Oct 10, 2026', body:'Draft agenda to confirm target enterprise valuation ranges.', isEmail:true, delivered:false }
  ];
  return [
    { id:'investor-com-1', channel:'Email (Sent)', title:'Q4 Software Dealflow Teaser Package', when:'Yesterday', recipient: record.contactEmail || 'partners@cobaltgp.com', body:`Hi ${record.name} team,\n\nSharing our latest qualified founder-led software mandates across Healthcare IT and FinTech that fit your mandate criteria.\n\nBest,\nMaya Chen`, isEmail:true, delivered:true },
    { id:'investor-com-2', channel:'Relationship note', title:'Mandate and criteria review', when:'Oct 9, 2026', body:`Reviewed ${record.type.toLowerCase()} check size parameters ($15M-$40M) and target EBITDA requirements.`, isEmail:false }
  ];
}

function getDemoDocuments(type, record) {
  if (type === 'seller') return [
    { id:'seller-doc-1', file:`${record.name} - Three Year Financial Model.xlsx`, ext:'xlsx', size:'840 KB', category:'Financial Statements', status:'Verified', meta:'Audited P&L, balance sheet, and forecast model' },
    { id:'seller-doc-2', file:`${record.name} - Executive CIM Deck.pptx`, ext:'pptx', size:'3.2 MB', category:'Presentations', status:'Ready', meta:'Investor overview presentation deck' },
    { id:'seller-doc-3', file:`${record.name} - Corporate Governance & Cap Table.pdf`, ext:'pdf', size:'410 KB', category:'Legal & Corporate', status:'Active', meta:'Certified share register and articles of incorporation' },
    { id:'seller-doc-4', file:`${record.name} - Customer Retention Cohort Analysis.docx`, ext:'docx', size:'260 KB', category:'Performance Data', status:'Verified', meta:'Net retention and churn breakdown' }
  ];
  return [
    { id:'investor-doc-1', file:`${record.name} - Investment Mandate Brief.pdf`, ext:'pdf', size:'320 KB', category:'Investment Criteria', status:'Active', meta:'Target enterprise value, check size, and deal governance' },
    { id:'investor-doc-2', file:`${record.name} - Standard NDA Form.docx`, ext:'docx', size:'180 KB', category:'Legal & Compliance', status:'Verified', meta:'Bilateral non-disclosure agreement template' }
  ];
}

function DetailProfilePage({
  profile, sellers, investors, sellerCustomFields, investorCustomFields,
  onAddCustomField, onUpdateCustomField, connectedEmail, onOpenEmailConfig,
  onPreviewDoc, backLabel, onBack, onNavigateProfile, setToast
}) {
  const { type, record } = profile;
  const [tab, setTab] = useState('Overview');
  const [communications, setCommunications] = useState(() => getDemoCommunications(type, record));
  const [documents, setDocuments] = useState(() => getDemoDocuments(type, record));
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [emailTo, setEmailTo] = useState(record.contactEmail || 'contact@entity.com');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('none');

  const isSeller = type === 'seller';
  const customFields = isSeller ? sellerCustomFields : investorCustomFields;
  const sections = isSeller ? sellerSections : investorSections;

  const rankedMatches = isSeller
    ? [...investors].map(investor => ({ item: investor, score: getInvestorMatchScore(investor, record) })).sort((a,b)=>b.score-a.score)
    : [...sellers].map(seller => ({ item: seller, score: getInvestorMatchScore(record, seller) })).sort((a,b)=>b.score-a.score);

  /* Email Templates Handler */
  const handleTemplateChange = (tpl) => {
    setSelectedTemplate(tpl);
    if (tpl === 'intro') {
      setEmailSubject(`Introductory Consultation & Advisory Mandate — ${record.name}`);
      setEmailBody(`Hi ${record.name} team,\n\nFollowing our initial discussions, I would like to schedule a dedicated valuation and readiness session to review your strategic transaction goals for the upcoming quarter.\n\nPlease let me know your availability this week.\n\nBest regards,\n${connectedEmail.name}\n${connectedEmail.title}\nZeon DealBridge`);
    } else if (tpl === 'diligence') {
      setEmailSubject(`Diligence Information Request — ${record.name}`);
      setEmailBody(`Hi ${record.name} deal team,\n\nTo prepare the confidential memorandum, please provide the latest 3-year historical financial model and customer cohort retention schedule.\n\nYou can also share files directly via our secure DealBridge document portal.\n\nBest,\n${connectedEmail.name}`);
    } else if (tpl === 'teaser') {
      setEmailSubject(`Confidential Opportunity Overview — Institutional Briefing`);
      setEmailBody(`Hi ${record.name} partners,\n\nWe have prepared an approved blind teaser for a high-growth founder-led software business in ${record.sector || 'your focus sector'} that strongly matches your mandate criteria ($15M-$40M check).\n\nPlease let us know if you would like to receive the non-disclosure agreement.\n\nBest regards,\n${connectedEmail.name}`);
    } else if (tpl === 'none') {
      setEmailSubject('');
      setEmailBody('');
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) return;

    const newComm = {
      id: `comm-email-${Date.now()}`,
      channel: 'Email (Sent)',
      title: emailSubject.trim(),
      when: 'Just now',
      recipient: emailTo.trim(),
      body: emailBody.trim(),
      isEmail: true,
      delivered: true
    };

    setCommunications(prev => [newComm, ...prev]);
    setShowEmailComposer(false);
    setEmailSubject('');
    setEmailBody('');
    setSelectedTemplate('none');
    setToast(`Email sent to ${emailTo.trim()} via ${connectedEmail.provider}!`);
  };

  /* Multi-format Document Upload Handler */
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const newDocs = files.map((file, idx) => {
      const ext = file.name.split('.').pop().toLowerCase();
      let category = 'Uploaded Asset';
      if (['pdf'].includes(ext)) category = 'Institutional PDF';
      else if (['doc','docx'].includes(ext)) category = 'Executive Document';
      else if (['ppt','pptx'].includes(ext)) category = 'Presentation Deck';
      else if (['png','jpg','jpeg','webp','svg'].includes(ext)) category = 'Image / Visual Asset';
      else if (['xlsx','xls','csv'].includes(ext)) category = 'Financial Model';

      const url = URL.createObjectURL(file);
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      return {
        id: `upload-${Date.now()}-${idx}`,
        file: file.name,
        ext,
        size: sizeStr,
        category,
        status: 'Active · Accessible',
        meta: `Uploaded just now · ${sizeStr}`,
        url
      };
    });

    setDocuments(prev => [...newDocs, ...prev]);
    event.target.value = '';
    setToast(`${files.length} document(s) uploaded and available for access.`);
  };

  return <section className="detail-profile-page">
    <div className="detail-profile-header">
      <div>
        <span className="control-label">{isSeller?'SELLER':'INVESTOR'} DETAIL</span>
        <h2>Detail profile: {record.name}</h2>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" className="button button-quiet" onClick={onAddCustomField}>
          <Plus size={14}/> Add custom field
        </button>
        <button type="button" className="button button-quiet" onClick={onBack}>
          <ArrowLeft size={15}/> Back to {backLabel}
        </button>
      </div>
    </div>

    <div className="detail-profile-identity">
      <Avatar initials={record.initials} color={record.color} size="lg"/>
      <div>
        <h3>{record.name}</h3>
        <span>{isSeller ? `${record.sector} · ${record.location}` : `${record.type} · ${record.status}`}</span>
      </div>
      <Badge tone={isSeller?'blue':'green'}>{isSeller?record.stage:record.status}</Badge>
    </div>

    <nav className="detail-profile-tabs" aria-label="Profile details">
      {['Overview','Communications','Documents', isSeller?'Matching investors':'Matching sellers'].map(tabName => (
        <button type="button" key={tabName} className={tab===tabName?'active':''} onClick={()=>setTab(tabName)}>
          {tabName}
          {tabName==='Documents' && <small className="tab-count">{documents.length}</small>}
          {tabName==='Communications' && <small className="tab-count">{communications.length}</small>}
        </button>
      ))}
    </nav>

    <div className="detail-profile-content">
      {/* ================= OVERVIEW TAB ================= */}
      {tab === 'Overview' && <>
        <p className="detail-profile-summary">{isSeller ? record.summary : record.description}</p>
        
        <div className="detail-fact-grid">
          {isSeller ? <>
            <div><span>Revenue</span><strong>{record.revenue}</strong></div>
            <div><span>Revenue growth</span><strong>{record.growth}</strong></div>
            <div><span>Customer retention</span><strong>{record.retention}</strong></div>
            <div><span>Owner goal</span><strong>{record.goal}</strong></div>
            <div><span>Timing</span><strong>{record.timing}</strong></div>
            <div><span>Lead source</span><strong>{record.source}</strong></div>
            <div><span>Relationship owner</span><strong>{record.owner}</strong></div>
            <div><span>Contact Email</span><strong>{record.contactEmail || 'founders@northstarcare.com'}</strong></div>
          </> : <>
            <div><span>Investor type</span><strong>{record.type}</strong></div>
            <div><span>Typical investment amount</span><strong>{record.check}</strong></div>
            <div><span>Geography</span><strong>{record.geography}</strong></div>
            <div><span>Investment stages</span><strong>{(record.stages||[]).join(', ')||'To confirm'}</strong></div>
            <div><span>Relationship status</span><strong>{record.status}</strong></div>
            <div><span>Last touch</span><strong>{record.lastTouch}</strong></div>
            <div><span>Deal Email</span><strong>{record.contactEmail || 'partners@fund.com'}</strong></div>
            <div><span>Active Mandates</span><strong>{(record.sectors||[]).join(', ')}</strong></div>
          </>}
        </div>

        {/* Custom Fields Panels Grouped by Section */}
        <div className="custom-fields-panel">
          <div className="custom-fields-header">
            <h4>Custom Profile Attributes ({customFields.length} configured)</h4>
            <button type="button" className="button button-secondary button-small" onClick={onAddCustomField}>
              <Plus size={13}/> Add field to all profiles
            </button>
          </div>

          {sections.map(secName => {
            const fieldsInSection = customFields.filter(f => f.section === secName);
            if (!fieldsInSection.length) return null;

            return <div className="custom-section-box" key={secName}>
              <div className="custom-section-title">
                <SlidersHorizontal size={13} color="#168f8c" />
                {secName}
              </div>
              <div className="custom-fields-grid">
                {fieldsInSection.map(field => {
                  const val = (record.customFieldValues && record.customFieldValues[field.id]) || '';
                  return <div className="custom-field-unit" key={field.id}>
                    <label>{field.label} <small style={{ color: '#8d9fae' }}>{field.type}</small></label>
                    <input
                      value={val}
                      placeholder={field.placeholder || 'Enter value…'}
                      onChange={e => onUpdateCustomField(field.id, e.target.value)}
                    />
                  </div>;
                })}
              </div>
            </div>;
          })}
        </div>

        <div className="detail-profile-note">
          <ShieldCheck size={15}/>
          <span>Custom fields added here automatically appear on all {isSeller?'seller':'investor'} profiles. Changes persist in local storage.</span>
        </div>
      </>}

      {/* ================= COMMUNICATIONS TAB ================= */}
      {tab === 'Communications' && <section className="detail-section">
        {/* Email Integration Bar */}
        <div className="email-integration-bar">
          <div className="email-account-info">
            <span className="email-connected-dot" />
            <div>
              <strong>Mail Integration: Connected ({connectedEmail.provider})</strong>
              <span>Sender: {connectedEmail.name} &lt;{connectedEmail.email}&gt;</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="button button-quiet button-small" onClick={onOpenEmailConfig}>
              <Settings size={14}/> Configure mail
            </button>
            <button type="button" className="button button-primary button-small" onClick={()=>setShowEmailComposer(v=>!v)}>
              <Mail size={14}/> Compose & send email
            </button>
          </div>
        </div>

        {/* Email Composer */}
        {showEmailComposer && <form className="email-composer-card" onSubmit={sendEmail}>
          <div className="email-composer-header">
            <h4>Compose Email via Connected Mailbox</h4>
            <div className="email-template-bar">
              <span>Use template:</span>
              <select value={selectedTemplate} onChange={e=>handleTemplateChange(e.target.value)}>
                <option value="none">Blank message</option>
                <option value="intro">Introductory Consultation & Agenda</option>
                <option value="diligence">Diligence & Financial Model Request</option>
                <option value="teaser">Confidential Opportunity Teaser Brief</option>
              </select>
            </div>
          </div>

          <div className="email-composer-row">
            <span>From:</span>
            <input disabled value={`${connectedEmail.name} <${connectedEmail.email}>`} />
          </div>

          <div className="email-composer-row">
            <span>To:</span>
            <input required type="email" value={emailTo} onChange={e=>setEmailTo(e.target.value)} />
          </div>

          <div className="email-composer-row">
            <span>Subject:</span>
            <input required value={emailSubject} placeholder="Enter message subject…" onChange={e=>setEmailSubject(e.target.value)} />
          </div>

          <textarea
            className="email-textarea"
            rows="5"
            required
            value={emailBody}
            placeholder="Write your email message here..."
            onChange={e=>setEmailBody(e.target.value)}
          />

          <div className="email-composer-actions">
            <span style={{ fontSize: 12, color: '#6a7d8e' }}>
              <Paperclip size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Direct TLS delivery via {connectedEmail.provider}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="button button-quiet button-small" onClick={()=>setShowEmailComposer(false)}>Cancel</button>
              <button type="submit" className="button button-primary button-small"><Send size={14}/> Send email</button>
            </div>
          </div>
        </form>}

        <div className="detail-section-heading">
          <div>
            <h3>Activity & Communications Log</h3>
            <p>Sent emails, relationship logs, and scheduled check-ins</p>
          </div>
        </div>

        <div className="communication-timeline">
          {communications.map(entry => (
            <article className="communication-entry" key={entry.id}>
              <span className="communication-icon" style={{ background: entry.isEmail ? '#e8f8f5' : '#f3f5ff', color: entry.isEmail ? '#169389' : '#6b68c9' }}>
                {entry.isEmail ? <Mail size={16}/> : <MessageSquareText size={16}/>}
              </span>
              <div style={{ flex: 1 }}>
                <div className="communication-title-row">
                  <strong>{entry.title}</strong>
                  <small>{entry.when}</small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                  <span className="communication-channel">{entry.channel}</span>
                  {entry.recipient && <span style={{ fontSize: 11.5, color: '#728495' }}>• To: {entry.recipient}</span>}
                  {entry.delivered && <span className="email-sent-badge"><Check size={11}/> Delivered</span>}
                </div>
                <p style={{ whiteSpace: 'pre-line' }}>{entry.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>}

      {/* ================= DOCUMENTS TAB ================= */}
      {tab === 'Documents' && <section className="detail-section">
        <div className="detail-section-heading">
          <div>
            <h3>Document Register & Secure Access</h3>
            <p>Support for image, PDF, DOC/DOCX, PPTX, and spreadsheet formats with instant preview and download</p>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <label className="document-upload-dropzone">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.xlsx,.xls,.txt"
            onChange={handleFileUpload}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#168f8c' }}>
            <Paperclip size={18} />
            <strong style={{ fontSize: 14 }}>Click to upload or drag & drop files</strong>
          </div>
          <span style={{ fontSize: 12, color: '#6f8192' }}>Available formats for preview and download:</span>
          <div className="supported-formats-pills">
            <span className="supported-format-tag">📄 PDF</span>
            <span className="supported-format-tag">📝 Word (.doc, .docx)</span>
            <span className="supported-format-tag">📊 PowerPoint (.ppt, .pptx)</span>
            <span className="supported-format-tag">🖼️ Images (PNG, JPG, WEBP)</span>
            <span className="supported-format-tag">📈 Excel (.xlsx, .csv)</span>
          </div>
        </label>

        {/* Document List */}
        <div className="document-list">
          {documents.map(document => {
            const ext = (document.ext || document.file.split('.').pop() || 'pdf').toLowerCase();
            let badgeClass = 'doc-badge-pdf';
            if (['doc','docx'].includes(ext)) badgeClass = 'doc-badge-doc';
            else if (['ppt','pptx'].includes(ext)) badgeClass = 'doc-badge-ppt';
            else if (['png','jpg','jpeg','webp','svg'].includes(ext)) badgeClass = 'doc-badge-img';
            else if (['xlsx','xls','csv'].includes(ext)) badgeClass = 'doc-badge-xls';

            return <article className="document-row" key={document.id}>
              <span className={`doc-format-badge ${badgeClass}`}>
                {ext.toUpperCase()}
              </span>
              <div className="document-copy">
                <strong>{document.file}</strong>
                <span>{document.category} · {document.meta || `${document.size || '300 KB'} · Verified register item`}</span>
              </div>
              <div className="document-row-actions">
                <button type="button" className="button button-quiet button-small" onClick={()=>onPreviewDoc(document)}>
                  <Eye size={13}/> Preview
                </button>
                <button type="button" className="button button-secondary button-small" onClick={()=>onPreviewDoc(document)}>
                  <Download size={13}/> Download
                </button>
              </div>
            </article>;
          })}
        </div>
      </section>}

      {/* ================= MATCHES TAB ================= */}
      {tab === (isSeller ? 'Matching investors' : 'Matching sellers') && <section className="detail-section">
        <div className="detail-section-heading">
          <div>
            <h3>{isSeller ? 'Suggested Matching Investors' : 'Suggested Matching Businesses'}</h3>
            <p>Calculated using sector affinity, stage alignment, and capital check criteria</p>
          </div>
        </div>
        <div className="detail-match-list">
          {rankedMatches.map(({ item, score }, index) => isSeller ? (
            <button type="button" className="detail-match-row" key={item.id} onClick={()=>onNavigateProfile('investor', item, record.id)}>
              <span className="match-rank">{index+1}</span>
              <Avatar initials={item.initials} color={item.color}/>
              <span className="detail-match-copy">
                <strong>{item.name}</strong>
                <small>{item.type} · {item.check} · {(item.sectors||[]).join(', ')}</small>
              </span>
              <span className="detail-match-score">{score}%</span>
              <ChevronRight size={15}/>
            </button>
          ) : (
            <button type="button" className="detail-match-row" key={item.id} onClick={()=>onNavigateProfile('seller', item)}>
              <span className="match-rank">{index+1}</span>
              <Avatar initials={item.initials} color={item.color}/>
              <span className="detail-match-copy">
                <strong>{item.name}</strong>
                <small>{item.sector} · {item.revenue} · {item.stage}</small>
              </span>
              <span className="detail-match-score">{score}%</span>
              <ChevronRight size={15}/>
            </button>
          ))}
        </div>
        <div className="detail-profile-note">
          <ShieldCheck size={15}/>
          <span>Match scores are advisory hypotheses. All outreach requires dual banker and client authorization.</span>
        </div>
      </section>}
    </div>

    <div className="detail-profile-footer">
      <span>ZEON DEALBRIDGE · CONFIDENTIAL INVESTMENT WORKSPACE</span>
      <button type="button" className="button button-quiet" onClick={onBack}>Back to workspace</button>
    </div>
  </section>;
}

/* ==========================================================================
   OTHER VIEWS (OVERVIEW, PIPELINE, INVESTORS, MATCHING, ETC.)
   ========================================================================== */

function Overview({
  sellers,
  investors,
  tasks,
  leads,
  ongoingDeals = [],
  setView,
  toggleTask,
  onOpenSeller,
  onOpenInvestor,
  openDetailProfile,
  onOpenLead,
  setModal,
  onUpdateSellerStage
}) {
  const activeMandates = sellers.filter(s => ['Preparing', 'In Market'].includes(s.stage)).length;
  const dueTasks = tasks.filter(t => !t.done);
  const pendingLeads = leads.filter(l => !l.status.startsWith('Qualified') && l.status !== 'Disqualified' && l.status !== 'Archived').length;

  // Investment Banking Portfolio Economics
  const totalPipelineEV = sellers.reduce((sum, s) => sum + parseRevenueValue(s.revenue), 0);
  const estSuccessFees = (totalPipelineEV * 0.028).toFixed(1); // illustrative 2.8% fee run-rate

  const liveDealVolume = ongoingDeals.reduce((sum, d) => sum + parseRevenueValue(d.dealSize), 0);
  const exclusivityDeals = ongoingDeals.filter(d => d.stage === 'LOI & Exclusivity').length;

  const funnelStages = [
    { id: 'New', label: 'New Lead', dot: 'slate' },
    { id: 'Qualified', label: 'Qualified', dot: 'blue' },
    { id: 'Preparing', label: 'Preparing', dot: 'amber' },
    { id: 'In Market', label: 'In Market', dot: 'emerald' },
    { id: 'Nurture', label: 'Nurture', dot: 'purple' }
  ];

  // Helper for mandate advisory type
  const getMandateType = (seller) => {
    if (seller.name === 'Northstar Care') return 'Majority Sale (M&A)';
    if (seller.name === 'CedarPay') return 'Growth Equity Round';
    if (seller.name === 'Atlas Market Data') return 'Sell-Side M&A';
    if (seller.name === 'BrightPath Learning') return 'Senior Credit Facility';
    return 'Sell-Side Advisory';
  };

  // Helper for next key deliverable
  const getDeliverable = (seller) => {
    if (seller.name === 'Northstar Care') return 'QofE Audit Final Draft';
    if (seller.name === 'CedarPay') return 'Customer Concentration Audit';
    if (seller.name === 'Atlas Market Data') return 'Blind Teaser Sign-Off';
    if (seller.name === 'BrightPath Learning') return 'Term Sheet Review';
    return 'Financial Package Review';
  };

  return (
    <div className="view-stack">
      {/* 1. Interactive Attio Stage Funnel Bar */}
      <div className="attio-funnel-strip">
        {funnelStages.map(st => {
          const stageSellers = sellers.filter(s => s.stage === st.id);
          const vol = sumVolume(stageSellers);
          return (
            <div
              key={st.id}
              className="attio-funnel-step"
              onClick={() => setView('sellers')}
              style={{ cursor: 'pointer' }}
              title={`View ${st.label} deals in Seller pipeline`}
            >
              <div className="attio-funnel-header">
                <div className="attio-funnel-step-name">
                  <span className={`attio-stage-dot ${st.dot}`} />
                  <span>{st.label}</span>
                </div>
                <span className="attio-funnel-count">{stageSellers.length}</span>
              </div>
              <div className="attio-funnel-volume">{vol}</div>
            </div>
          );
        })}
      </div>

      {/* 2. Investment Banking Executive KPI Row */}
      <div className="ib-metrics-grid">
        <div className="ib-metric-card">
          <div className="ib-metric-top">
            <span className="ib-metric-label">Sell-Side Pipeline</span>
            <span className="ib-metric-tag ib-tag-spruce">5 Mandates · 100% Retained</span>
          </div>
          <div className="ib-metric-main">
            <span className="ib-metric-val">${totalPipelineEV}M</span>
            <span className="ib-metric-trend"><TrendingUp size={13} /> +18% QoQ</span>
          </div>
          <div className="ib-metric-sub">Est. ${estSuccessFees}M Success Fee Run-Rate (2.8% avg)</div>
          <div className="ib-metric-meta">
            <span>Avg Mandate: <strong>$26.8M EV</strong></span>
            <span>Preparing: <strong>$41M</strong></span>
          </div>
        </div>

        <div className="ib-metric-card">
          <div className="ib-metric-top">
            <span className="ib-metric-label">Live Deal Volume</span>
            <span className="ib-metric-tag ib-tag-blue">{ongoingDeals.length} Active Processes</span>
          </div>
          <div className="ib-metric-main">
            <span className="ib-metric-val">${liveDealVolume}M</span>
            <span className="ib-metric-trend"><Handshake size={13} /> {exclusivityDeals} in LOI</span>
          </div>
          <div className="ib-metric-sub">Active counterparty diligence & exclusivity</div>
          <div className="ib-metric-meta">
            <span>Largest: <strong>$70M (CedarPay)</strong></span>
            <span>Credit: <strong>$25M</strong></span>
          </div>
        </div>

        <div className="ib-metric-card">
          <div className="ib-metric-top">
            <span className="ib-metric-label">Buyer Universe</span>
            <span className="ib-metric-tag ib-tag-purple">100% Sponsor Reach</span>
          </div>
          <div className="ib-metric-main">
            <span className="ib-metric-val">{investors.length} Funds</span>
            <span className="ib-metric-trend"><UsersRound size={13} /> 14 NDAs Active</span>
          </div>
          <div className="ib-metric-sub">8 CIMs Distributed · 4 IOIs · 2 LOIs</div>
          <div className="ib-metric-meta">
            <span>Private Equity: <strong>4</strong></span>
            <span>Debt/Growth: <strong>2</strong></span>
          </div>
        </div>

        <div className="ib-metric-card">
          <div className="ib-metric-top">
            <span className="ib-metric-label">Readiness & Velocity</span>
            <span className="ib-metric-tag ib-tag-teal">0 Stalled Deals</span>
          </div>
          <div className="ib-metric-main">
            <span className="ib-metric-val">88% Fit</span>
            <span className="ib-metric-trend"><ShieldCheck size={13} /> 2 Launch-Ready</span>
          </div>
          <div className="ib-metric-sub">{pendingLeads} Pending Inbounds · Confirmatory DD: 2</div>
          <div className="ib-metric-meta">
            <span>QofE Audit: <strong>In Review</strong></span>
            <span>Avg Cycle: <strong>42 Days</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Core Active Advisory Mandates Dealbook */}
      <section className="dealbook-card">
        <div className="dealbook-header">
          <div>
            <div className="dealbook-header-left">
              <h3>Active Advisory Mandates (Dealbook)</h3>
              <span className="dealbook-badge">{sellers.length} active mandates</span>
            </div>
            <p>Sell-side M&A, growth recapitalizations, and institutional capital advisory portfolio</p>
          </div>
          <button type="button" className="dealbook-action-btn primary" onClick={() => setView('sellers')}>
            <Kanban size={13} /> Open Kanban Board
          </button>
        </div>

        <div className="dealbook-table-wrap">
          <table className="dealbook-table">
            <thead>
              <tr>
                <th>Company & Sector</th>
                <th>Mandate Type</th>
                <th>Financial Profile</th>
                <th>Process Stage</th>
                <th>Advisory Lead</th>
                <th>Top Sponsor Matches</th>
                <th>Next Key Deliverable</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map(s => {
                const stageDotColor = s.stage === 'In Market' ? 'emerald' : s.stage === 'Preparing' ? 'amber' : s.stage === 'Qualified' ? 'blue' : 'slate';
                const matchedSponsors = investors
                  .map(inv => ({ inv, score: getInvestorMatchScore(inv, s) }))
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 2);

                return (
                  <tr key={s.id}>
                    <td>
                      <div className="dealbook-company-cell">
                        <Avatar initials={s.name.slice(0, 2).toUpperCase()} color="mint" />
                        <div>
                          <div className="dealbook-company-name">{s.name}</div>
                          <div className="dealbook-company-sector">{s.sector} · {s.location}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="dealbook-mandate-type">{getMandateType(s)}</div>
                    </td>
                    <td>
                      <div className="dealbook-fin-cell">
                        <div className="dealbook-fin-ev">{s.revenue} ARR</div>
                        <div className="dealbook-fin-rev">{s.ebitda || 'Target $30M–$38M EV'}</div>
                      </div>
                    </td>
                    <td>
                      <span className="attio-pill">
                        <span className={`attio-stage-dot ${stageDotColor}`} />
                        {s.stage}
                      </span>
                    </td>
                    <td>
                      <div className="attio-card-owner">
                        <Avatar initials={s.owner ? s.owner.split(' ').map(n=>n[0]).join('') : 'MC'} size="xs" color="mint" />
                        <span>{s.owner || 'Maya Chen'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {matchedSponsors.map(({ inv, score }) => (
                          <span
                            key={inv.id}
                            className="attio-pill fit"
                            style={{ cursor: 'pointer' }}
                            onClick={() => onOpenInvestor ? onOpenInvestor(inv, s.id) : setView('investors')}
                            title={`Click to view ${inv.name} match profile`}
                          >
                            ✦ {inv.name.split(' ')[0]} ({score}%)
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="dealbook-deliverable-pill">
                        <Clock3 size={11} /> {getDeliverable(s)}
                      </span>
                    </td>
                    <td>
                      <div className="dealbook-actions">
                        <button
                          type="button"
                          className="dealbook-action-btn"
                          onClick={() => onOpenSeller(s)}
                          title="Open seller quick-view drawer"
                        >
                          Quick View
                        </button>
                        <button
                          type="button"
                          className="dealbook-action-btn primary"
                          onClick={() => openDetailProfile ? openDetailProfile('seller', s) : onOpenSeller(s)}
                          title="Open full detail profile page"
                        >
                          Detail Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Middle Two-Column Grid: Live Transactions War Room & Critical Path */}
      <div className="ib-two-col">
        {/* Left: Live Transactions War Room */}
        <section className="dealbook-card">
          <div className="dealbook-header">
            <div>
              <div className="dealbook-header-left">
                <h3>Live Transactions & Diligence War Room</h3>
                <span className="dealbook-badge">{ongoingDeals.length} active</span>
              </div>
              <p>Active counterparty processes in market, exclusivity, and closing</p>
            </div>
            <button type="button" className="dealbook-action-btn" onClick={() => setView('ongoing')}>
              View Ongoing Board <ArrowRight size={13} />
            </button>
          </div>

          <div className="live-process-list">
            {ongoingDeals.map(d => {
              const ms = Array.isArray(d.milestones) ? d.milestones : [];
              const completedCount = ms.filter(m => m.done).length;
              const totalCount = ms.length || 1;
              const compPercent = Math.min(100, Math.round((completedCount / totalCount) * 100));
              const stageColor = d.stage === 'LOI & Exclusivity' ? 'emerald' : d.stage === 'Confirmatory DD' ? 'amber' : 'blue';

              return (
                <div
                  key={d.id}
                  className="live-process-item"
                  onClick={() => setView('ongoing')}
                  title="Click to manage ongoing transaction"
                >
                  <div className="live-process-header">
                    <div className="live-process-parties">
                      <span>{d.sellerName}</span>
                      <span className="vs">with</span>
                      <span className="sponsor">{d.investorName}</span>
                    </div>
                    <span className="live-process-size-badge">{d.dealSize}</span>
                  </div>

                  <div className="live-process-meta">
                    <span className="attio-pill">
                      <span className={`attio-stage-dot ${stageColor}`} />
                      {d.stage}
                    </span>
                    <span>
                      Diligence Milestones: <strong>{completedCount}/{totalCount}</strong> ({compPercent}%)
                    </span>
                  </div>

                  <div className="live-process-bar">
                    <div className="live-process-fill" style={{ width: `${compPercent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right: Banker Action Center ("Needs Attention") */}
        <section className="dealbook-card">
          <div className="dealbook-header">
            <div>
              <div className="dealbook-header-left">
                <h3>Critical Path & Banker Gateways</h3>
                <span className="dealbook-badge">Needs Attention</span>
              </div>
              <p>High-stakes actions requiring partner sign-off before market launch</p>
            </div>
            <button type="button" className="dealbook-action-btn" onClick={() => setView('tasks')}>
              View All Tasks <ArrowRight size={13} />
            </button>
          </div>

          <div className="banker-action-list">
            <div className="banker-action-item">
              <span className="banker-action-indicator ind-red" />
              <div className="banker-action-content">
                <div className="banker-action-top">
                  <span className="banker-action-tag tag-red">Confidential Outreach</span>
                  <span className="attio-pill">Atlas Market Data</span>
                </div>
                <div className="banker-action-title">Blind teaser approved by founder</div>
                <div className="banker-action-desc">
                  Lead banker Maya Chen must approve the 12 sponsor recipients list before simulated blind distribution.
                </div>
                <button type="button" className="banker-action-btn" onClick={() => setView('blind')}>
                  Review Outreach Gateways <ArrowRight size={12} />
                </button>
              </div>
            </div>

            <div className="banker-action-item">
              <span className="banker-action-indicator ind-amber" />
              <div className="banker-action-content">
                <div className="banker-action-top">
                  <span className="banker-action-tag tag-amber">Diligence & QofE</span>
                  <span className="attio-pill">Northstar Care</span>
                </div>
                <div className="banker-action-title">Preliminary QofE draft delivered</div>
                <div className="banker-action-desc">
                  Confirm source revenue recognition schedules and customer concentration audit before LOI exclusivity expires.
                </div>
                <button type="button" className="banker-action-btn" onClick={() => setView('readiness')}>
                  Open Readiness Checklist <ArrowRight size={12} />
                </button>
              </div>
            </div>

            <div className="banker-action-item">
              <span className="banker-action-indicator ind-blue" />
              <div className="banker-action-content">
                <div className="banker-action-top">
                  <span className="banker-action-tag tag-blue">Inbound Triage</span>
                  <span className="attio-pill">3 Submissions</span>
                </div>
                <div className="banker-action-title">High-priority inbound founder submissions</div>
                <div className="banker-action-desc">
                  Clinical pathology diagnostics and logistics routing companies awaiting banker review and mandate qualification.
                </div>
                <button type="button" className="banker-action-btn" onClick={() => setView('leads')}>
                  Triage Inbound Leads <ArrowRight size={12} />
                </button>
              </div>
            </div>

            <div className="banker-action-item">
              <span className="banker-action-indicator ind-green" />
              <div className="banker-action-content">
                <div className="banker-action-top">
                  <span className="banker-action-tag tag-green">Exclusivity Window</span>
                  <span className="attio-pill">Harborline Capital</span>
                </div>
                <div className="banker-action-title">45-day exclusivity window: 14 days remaining</div>
                <div className="banker-action-desc">
                  Legal counsel finalizing TSA and definitive asset purchase agreement for Northstar Care majority recap.
                </div>
                <button type="button" className="banker-action-btn" onClick={() => setView('blind')}>
                  View Non-Binding Terms <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 5. Bottom Two-Column Grid: Sponsor Universe & Deal Team Tasks */}
      <div className="ib-two-col">
        {/* Left: Institutional Sponsor Universe */}
        <section className="dealbook-card">
          <div className="dealbook-header">
            <div>
              <div className="dealbook-header-left">
                <h3>Institutional Sponsor Universe</h3>
                <span className="dealbook-badge">{investors.length} active funds</span>
              </div>
              <p>Top private equity sponsors, growth equity, and private credit partners</p>
            </div>
            <button type="button" className="dealbook-action-btn" onClick={() => setView('matching')}>
              Matchmaking Matrix <ArrowRight size={13} />
            </button>
          </div>

          <div className="sponsor-mini-list">
            {investors.slice(0, 4).map(inv => (
              <div
                key={inv.id}
                className="sponsor-mini-item"
                onClick={() => onOpenInvestor ? onOpenInvestor(inv) : setView('investors')}
                title="Click to view investor quick drawer"
              >
                <div className="sponsor-mini-left">
                  <Avatar initials={inv.name.slice(0, 2).toUpperCase()} color="lavender" />
                  <div>
                    <div className="sponsor-mini-name">{inv.name}</div>
                    <div className="sponsor-mini-type">{inv.type} · {inv.geography}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="sponsor-mini-check">{inv.check}</span>
                  <span className="attio-pill fit">✦ {inv.sector}</span>
                  <ChevronRight size={15} color="#94a3b8" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Upcoming Deal Team Tasks */}
        <section className="dealbook-card">
          <div className="dealbook-header">
            <div>
              <div className="dealbook-header-left">
                <h3>Upcoming Deal Team Tasks</h3>
                <span className="dealbook-badge">{tasks.filter(t => !t.done).length} open</span>
              </div>
              <p>Critical advisory deliverables, client checkpoints, and filings due this week</p>
            </div>
            <button type="button" className="dealbook-action-btn" onClick={() => setView('tasks')}>
              Tasks Kanban Board <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tasks.filter(t => !t.done).slice(0, 4).map(task => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #f1f5f9',
                  background: '#f8fafc',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#198757' }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 650, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.name}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                      {task.company} · {task.kind}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span className="attio-pill" style={{ color: task.due === 'Today' ? '#dc2626' : '#64748b', fontWeight: 700 }}>
                    <CalendarDays size={11} /> {task.due}
                  </span>
                  <Avatar initials={task.owner ? task.owner.split(' ').map(n=>n[0]).join('') : 'MC'} size="xs" color="mint" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SellerPipeline({ sellers, allSellers, searchText, setSearchText, stageFilter, setStageFilter, sectorFilter, setSectorFilter, onOpenSeller, setModal, onUpdateStage }) {
  const [viewMode, setViewMode] = useState('board');
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);
  const [sortBy, setSortBy] = useState('fit');

  const stages = [
    { id: 'New', label: 'New Lead', dot: 'slate' },
    { id: 'Qualified', label: 'Qualified', dot: 'blue' },
    { id: 'Preparing', label: 'Preparing', dot: 'amber' },
    { id: 'In Market', label: 'In Market', dot: 'emerald' },
    { id: 'Nurture', label: 'Nurture', dot: 'purple' }
  ];

  const filtered = useMemo(() => {
    let list = allSellers.filter(s => {
      const q = searchText.toLowerCase();
      const matchSearch = !q || [s.name, s.sector, s.source, s.owner, s.summary, s.location].join(' ').toLowerCase().includes(q);
      const matchSector = sectorFilter === 'All sectors' || s.sector === sectorFilter;
      const matchStage = viewMode === 'board' ? true : (stageFilter === 'All sellers' || s.stage === stageFilter);
      return matchSearch && matchSector && matchStage;
    });

    if (sortBy === 'fit') {
      list = [...list].sort((a, b) => (b.fit || 0) - (a.fit || 0));
    } else if (sortBy === 'revenue') {
      list = [...list].sort((a, b) => parseRevenueValue(b.revenue) - parseRevenueValue(a.revenue));
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [allSellers, searchText, sectorFilter, stageFilter, sortBy, viewMode]);

  const handleDragStart = (e, sellerId) => {
    e.dataTransfer.setData('text/plain', sellerId);
    setDraggedId(sellerId);
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    if (dragOverStage !== stageId) setDragOverStage(stageId);
  };

  const handleDragLeave = (e, stageId) => {
    if (dragOverStage === stageId) setDragOverStage(null);
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    setDragOverStage(null);
    const sellerId = e.dataTransfer.getData('text/plain') || draggedId;
    if (sellerId && onUpdateStage) {
      onUpdateStage(sellerId, stageId);
    }
    setDraggedId(null);
  };

  const handleShiftStage = (e, seller, direction) => {
    e.stopPropagation();
    const stageIds = stages.map(s => s.id);
    const curIdx = stageIds.indexOf(seller.stage);
    if (curIdx === -1) return;
    const nextIdx = direction === 'next' ? Math.min(stageIds.length - 1, curIdx + 1) : Math.max(0, curIdx - 1);
    if (nextIdx !== curIdx && onUpdateStage) {
      onUpdateStage(seller.id, stageIds[nextIdx]);
    }
  };

  return (
    <div className="view-stack">
      {/* Attio View Controls Toolbar */}
      <div className="attio-view-bar">
        <div className="attio-view-bar-left">
          <div className="attio-view-title">
            <Building2 size={16} />
            <span>Seller Pipeline</span>
            <span className="attio-view-count-badge">{filtered.length} companies</span>
          </div>

          <div className="attio-view-switcher">
            <button
              type="button"
              className={`attio-view-btn ${viewMode === 'board' ? 'active' : ''}`}
              onClick={() => setViewMode('board')}
            >
              <Kanban size={13} />
              <span>Board</span>
            </button>
            <button
              type="button"
              className={`attio-view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <List size={13} />
              <span>Table</span>
            </button>
          </div>
        </div>

        <div className="attio-view-bar-right">
          <div className="attio-search-box">
            <Search size={14} />
            <input
              placeholder="Search companies, owners, sectors..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <kbd>/</kbd>
          </div>

          <CustomSelect
            value={sectorFilter}
            onChange={setSectorFilter}
            options={['All sectors', ...new Set(allSellers.map(s => s.sector))]}
            placeholder="All sectors"
          />

          <CustomSelect
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: 'fit', label: 'Sort: Suggested Fit' },
              { value: 'revenue', label: 'Sort: Deal Revenue' },
              { value: 'name', label: 'Sort: Company Name' }
            ]}
          />

          <button
            type="button"
            className="button button-primary button-small"
            onClick={() => setModal({ type: 'seller' })}
          >
            <Plus size={15} /> Add Deal
          </button>
        </div>
      </div>

      {viewMode === 'board' ? (
        <div className="attio-kanban-board">
          {stages.map(st => {
            const columnSellers = filtered.filter(s => s.stage === st.id);
            const totalVol = sumVolume(columnSellers);
            const isOver = dragOverStage === st.id;

            return (
              <div
                key={st.id}
                className={`attio-kanban-column ${isOver ? 'drag-over' : ''}`}
                onDragOver={e => handleDragOver(e, st.id)}
                onDragLeave={e => handleDragLeave(e, st.id)}
                onDrop={e => handleDrop(e, st.id)}
              >
                <div className="attio-column-header">
                  <div className="attio-column-title-wrap">
                    <span className={`attio-stage-dot ${st.dot}`} />
                    <span className="attio-column-name">{st.label}</span>
                    <span className="attio-column-count">{columnSellers.length}</span>
                  </div>
                  <div className="attio-column-actions">
                    <span className="attio-column-volume">{totalVol}</span>
                    <button
                      type="button"
                      className="attio-column-add-btn"
                      title={`Add deal to ${st.label}`}
                      onClick={() => setModal({ type: 'seller' })}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                <div className="attio-cards-list">
                  {columnSellers.map(seller => {
                    const stageIds = stages.map(s => s.id);
                    const sIdx = stageIds.indexOf(seller.stage);
                    const canMoveLeft = sIdx > 0;
                    const canMoveRight = sIdx < stageIds.length - 1;

                    return (
                      <div
                        key={seller.id}
                        className={`attio-card ${draggedId === seller.id ? 'dragging' : ''}`}
                        draggable={true}
                        onDragStart={e => handleDragStart(e, seller.id)}
                        onClick={() => onOpenSeller(seller)}
                      >
                        <div className="attio-card-header">
                          <div className="attio-card-title-group">
                            <CompanyLogo name={seller.name} initials={seller.initials} size="sm" />
                            <div className="attio-card-title">{seller.name}</div>
                          </div>
                          <div className="attio-card-shift-actions" onClick={e => e.stopPropagation()}>
                            {canMoveLeft && (
                              <button
                                type="button"
                                className="attio-card-shift-btn"
                                title="Move back one stage"
                                onClick={e => handleShiftStage(e, seller, 'prev')}
                              >
                                <ArrowLeft size={11} />
                              </button>
                            )}
                            {canMoveRight && (
                              <button
                                type="button"
                                className="attio-card-shift-btn"
                                title="Advance to next stage"
                                onClick={e => handleShiftStage(e, seller, 'next')}
                              >
                                <ArrowRight size={11} />
                              </button>
                            )}
                          </div>
                        </div>

                        {seller.summary && <p className="attio-card-desc">{seller.summary}</p>}

                        <div className="attio-card-pills">
                          <span className="attio-pill attio-pill-rev">
                            <CircleDollarSign size={11} />
                            {seller.revenue}
                          </span>
                          <span className="attio-pill attio-pill-sector">
                            {seller.sector}
                          </span>
                          <span className="attio-pill attio-pill-fit">
                            <Sparkles size={11} />
                            {seller.fit}% Fit
                          </span>
                        </div>

                        {seller.next && (
                          <div className="attio-card-next">
                            <Clock3 size={11} />
                            <span>{seller.next}</span>
                          </div>
                        )}

                        <div className="attio-card-footer">
                          <div className="attio-card-owner">
                            <Avatar initials={seller.owner.split(' ').map(x => x[0]).join('').slice(0, 2)} color="mint" size="xs" />
                            <span>{seller.owner}</span>
                          </div>
                          <span>{seller.updated}</span>
                        </div>
                      </div>
                    );
                  })}

                  {columnSellers.length === 0 && (
                    <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                      No deals in {st.label}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="attio-column-bottom-add"
                  onClick={() => setModal({ type: 'seller' })}
                >
                  <Plus size={13} /> New deal
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <section className="card full-card">
          <div className="pipeline-toolbar">
            <div className="segmented">
              {['All sellers', ...stages.map(s => s.id)].map(stage => (
                <button
                  key={stage}
                  className={stageFilter === stage ? 'selected' : ''}
                  onClick={() => setStageFilter(stage)}
                >
                  {stage}
                  <span>{stage === 'All sellers' ? allSellers.length : allSellers.filter(s => s.stage === stage).length}</span>
                </button>
              ))}
            </div>
          </div>
          {filtered.length ? (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Sector</th>
                    <th>Revenue</th>
                    <th>Stage</th>
                    <th>Fit</th>
                    <th>Next step</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <TableRow key={s.id} seller={s} onClick={() => onOpenSeller(s)} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No sellers found" message="Try another stage, sector, or search term." />
          )}
          <div className="table-bottom">
            <span>Showing {filtered.length} records</span>
            <div className="pagination">
              <button disabled>Previous</button>
              <button className="page-number">1</button>
              <button>Next</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function InvestorNetwork({ investors, sellers, searchText, setSearchText, onOpenInvestor, setModal, onUpdateStatus }) {
  const [viewMode, setViewMode] = useState('board');
  const [filter, setFilter] = useState('All');
  const [draggedInvId, setDraggedInvId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const statusCols = [
    { id: 'Active', label: 'Active', dot: 'emerald' },
    { id: 'Warm', label: 'Warm', dot: 'amber' },
    { id: 'Nurture', label: 'Nurture', dot: 'blue' },
    { id: 'New', label: 'New', dot: 'slate' }
  ];

  const matches = useMemo(() => {
    return investors.filter(i => {
      const matchFilter = viewMode === 'board' ? true : (filter === 'All' || i.status === filter);
      const matchSearch = !searchText || [i.name, i.type, ...(i.sectors || [])].join(' ').toLowerCase().includes(searchText.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [investors, filter, searchText, viewMode]);

  const handleDragStart = (e, invId) => {
    e.dataTransfer.setData('text/plain', invId);
    setDraggedInvId(invId);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (dragOverCol !== colId) setDragOverCol(colId);
  };

  const handleDragLeave = (e, colId) => {
    if (dragOverCol === colId) setDragOverCol(null);
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setDragOverCol(null);
    const invId = e.dataTransfer.getData('text/plain') || draggedInvId;
    if (invId && onUpdateStatus) {
      onUpdateStatus(invId, colId);
    }
    setDraggedInvId(null);
  };

  return <div className="view-stack">
    {/* Attio View Controls Toolbar */}
    <div className="attio-view-bar">
      <div className="attio-view-bar-left">
        <div className="attio-view-title">
          <UsersRound size={16} />
          <span>Investor Network</span>
          <span className="attio-view-count-badge">{matches.length} profiles</span>
        </div>

        <div className="attio-view-switcher">
          <button
            type="button"
            className={`attio-view-btn ${viewMode === 'board' ? 'active' : ''}`}
            onClick={() => setViewMode('board')}
          >
            <Kanban size={13} />
            <span>Board</span>
          </button>
          <button
            type="button"
            className={`attio-view-btn ${viewMode === 'directory' ? 'active' : ''}`}
            onClick={() => setViewMode('directory')}
          >
            <LayoutGrid size={13} />
            <span>Directory</span>
          </button>
        </div>
      </div>

      <div className="attio-view-bar-right">
        <div className="attio-search-box">
          <Search size={14} />
          <input
            placeholder="Search investors or sectors…"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <kbd>/</kbd>
        </div>

        <button
          type="button"
          className="button button-primary button-small"
          onClick={() => setModal({ type: 'investor' })}
        >
          <Plus size={15} /> Add Investor
        </button>
      </div>
    </div>

    {viewMode === 'board' ? (
      <div className="attio-kanban-board">
        {statusCols.map(col => {
          const colInvs = matches.filter(i => i.status === col.id);
          const isOver = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              className={`attio-kanban-column ${isOver ? 'drag-over' : ''}`}
              onDragOver={e => handleDragOver(e, col.id)}
              onDragLeave={e => handleDragLeave(e, col.id)}
              onDrop={e => handleDrop(e, col.id)}
            >
              <div className="attio-column-header">
                <div className="attio-column-title-wrap">
                  <span className={`attio-stage-dot ${col.dot}`} />
                  <span className="attio-column-name">{col.label}</span>
                  <span className="attio-column-count">{colInvs.length}</span>
                </div>
                <button
                  type="button"
                  className="attio-column-add-btn"
                  title={`Add investor to ${col.label}`}
                  onClick={() => setModal({ type: 'investor' })}
                >
                  <Plus size={13} />
                </button>
              </div>

              <div className="attio-cards-list">
                {colInvs.map(investor => {
                  return (
                    <div
                      key={investor.id}
                      className={`attio-card ${draggedInvId === investor.id ? 'dragging' : ''}`}
                      draggable={true}
                      onDragStart={e => handleDragStart(e, investor.id)}
                      onClick={() => onOpenInvestor(investor)}
                    >
                      <div className="attio-card-header">
                        <div className="attio-card-title-group">
                          <CompanyLogo name={investor.name} initials={investor.initials} size="sm" />
                          <div className="attio-card-title">{investor.name}</div>
                        </div>
                      </div>

                      {investor.description && <p className="attio-card-desc">{investor.description}</p>}

                      <div className="attio-card-pills">
                        <span className="attio-pill attio-pill-rev">
                          <CircleDollarSign size={11} /> {investor.check}
                        </span>
                        <span className="attio-pill">
                          {investor.type}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
                        {(investor.sectors || []).slice(0, 2).map(s => (
                          <span key={s} className="soft-tag" style={{ fontSize: '10.5px', padding: '2px 6px' }}>{s}</span>
                        ))}
                      </div>

                      <div className="attio-card-footer">
                        <span>{investor.geography}</span>
                        <span>{investor.lastTouch}</span>
                      </div>
                    </div>
                  );
                })}

                {colInvs.length === 0 && (
                  <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                    No investors in {col.label}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="attio-column-bottom-add"
                onClick={() => setModal({ type: 'investor' })}
              >
                <Plus size={13} /> Add investor
              </button>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="card full-card">
        <div className="network-toolbar">
          <div className="segmented">{['All','Active','Warm','Nurture'].map(s=><button key={s} className={filter===s?'selected':''} onClick={()=>setFilter(s)}>{s}</button>)}</div>
        </div>
        <div className="investor-grid">
          {matches.map(investor=><InvestorCard key={investor.id} investor={investor} onClick={()=>onOpenInvestor(investor)} />)}
        </div>
        {!matches.length && <EmptyState title="No investors found" message="Try another search or status."/>}
        <div className="table-bottom"><span>{matches.length} shown · {investors.length} profiles</span><span className="text-muted">Verified capital providers.</span></div>
      </div>
    )}
  </div>;
}

function InvestorCard({ investor, onClick }) {
  const tone={Active:'green',Warm:'blue',Nurture:'amber',New:'slate'}[investor.status]||'slate';
  return <article className="investor-card investor-card-clickable">
    <button type="button" className="investor-card-hit-area" onClick={onClick} aria-label={`Open investor profile for ${investor.name}`} />
    <div className="investor-card-top"><CompanyLogo name={investor.name} initials={investor.initials} size="lg"/><span className="dots-button dots-static" aria-hidden="true"><MoreHorizontal size={18}/></span></div>
    <div className="investor-name"><h3>{investor.name}</h3><Badge tone={tone}>{investor.status}</Badge></div>
    <p className="investor-type">{investor.type}</p>
    <p className="investor-description">{investor.description}</p>
    <div className="investor-details"><div><span>Typical amount</span><strong>{investor.check}</strong></div><div><span>Location</span><strong>{investor.geography}</strong></div></div>
    <div className="tag-row">{investor.sectors.slice(0,3).map(tag=><span className="soft-tag" key={tag}>{tag}</span>)}</div>
    <div className="investor-card-bottom"><span><Clock3 size={13}/> {investor.lastTouch}</span><span className="profile-link">View profile <ArrowRight size={14}/></span></div>
  </article>;
}

function MatchingView({ sellers, investors, selectedSellerId, setSelectedSellerId, setSelectedInvestorId, setView, setToast, onInitiateDeal }) {
  const seller = sellers.find(s=>s.id===selectedSellerId)||sellers[0];
  const matchScores = (investor) => getInvestorMatchScore(investor,seller);
  const ranked = [...investors].sort((a,b)=>matchScores(b)-matchScores(a));
  const stageTone = { 'Qualified':'green','Preparing':'blue','Nurture':'amber','In Market':'purple','New':'slate' }[seller?.stage] || 'slate';
  return <div className="view-stack">
    <section className="card match-control">
      <div>
        <span className="control-label">MATCH SELLERS TO INVESTORS</span>
        <h3>Choose a seller profile</h3>
        <p>Matches are suggestions. A banker approves every investor list and can initiate concurrent deals.</p>
      </div>
      <CustomSellerSelect
        sellers={sellers}
        selectedSellerId={seller?.id}
        onSelect={setSelectedSellerId}
        label="Target Company"
      />
    </section>
    <div className="matching-layout">
      <section className="card seller-match-card">
        <div className="card-heading">
          <div>
            <h3>Seller snapshot</h3>
            <p>Information approved for matching</p>
          </div>
          <Badge tone={stageTone}>{seller?.stage}</Badge>
        </div>
        <div className="match-company">
          <CompanyLogo name={seller?.name} initials={seller?.initials} size="lg"/>
          <div>
            <strong>{seller?.name}</strong>
            <span>{seller?.sector} · {seller?.location}</span>
          </div>
        </div>
        <p className="seller-summary">{seller?.summary}</p>
        <div className="snapshot-grid">
          <div><span>Revenue</span><strong>{seller?.revenue}</strong></div>
          <div><span>Growth</span><strong>{seller?.growth}</strong></div>
          <div><span>Seller goal</span><strong>{seller?.goal}</strong></div>
          <div><span>Timing</span><strong>{seller?.timing}</strong></div>
        </div>
        <div className="match-tags">
          {seller?.tags?.map(t=><span className="soft-tag" key={t}>{t}</span>)}
        </div>
        <div className="match-card-actions">
          <button className="button button-secondary flex-1" onClick={()=>setView('blind')}>
            <EyeOff size={16}/> Anonymous teaser
          </button>
          <button className="button button-quiet flex-1" onClick={()=>setView('ongoing')}>
            <Handshake size={16}/> Ongoing deals
          </button>
        </div>
      </section>
      <section className="card matches-card">
        <div className="card-heading">
          <div>
            <h3>Suggested investors</h3>
            <p>{ranked.length} profiles compared with this seller. Initiate one or multiple live deals.</p>
          </div>
          <button className="square-button" aria-label="Filter matches"><SlidersHorizontal size={15}/></button>
        </div>
        <div className="match-list">
          {ranked.map((investor,idx)=>{
            const score=matchScores(investor);
            const isStrong=investor.sectors.includes(seller?.sector);
            return <div className="match-row" key={investor.id}>
              <div className="match-rank">{idx+1}</div>
              <CompanyLogo name={investor.name} initials={investor.initials} size="md"/>
              <div className="match-row-main">
                <strong>{investor.name}</strong>
                <span>{investor.type} · {investor.check}</span>
                <small><Check size={12}/> {isStrong?`Sector fit: ${seller?.sector}`:'Stage and geography fit'} · {investor.geography}</small>
              </div>
              <div className="match-score">
                <strong>{score}%</strong>
                <ProgressBar value={score} color={score>85?'teal':'blue'}/>
              </div>
              <div className="match-row-actions">
                <button
                  type="button"
                  className="button button-primary button-small initiate-deal-btn"
                  onClick={() => onInitiateDeal ? onInitiateDeal(seller, investor, score) : null}
                  title="Initiate live deal transaction between this seller and investor"
                >
                  <Handshake size={14}/> Initiate Deal
                </button>
                <button
                  type="button"
                  className="icon-button"
                  onClick={()=>{setSelectedInvestorId(investor.id);setToast(`Match saved: ${investor.name}`);}}
                  title="Save match"
                >
                  <Plus size={16}/>
                </button>
              </div>
            </div>;
          })}
        </div>
      </section>
    </div>
  </div>;
}


const readinessItems = [
  { title:'Three years of audited financial statements', detail:'Income statement, balance sheet, and cash flow' },
  { title:'Operating plan and forecast model', detail:'Current plan with key operational assumptions' },
  { title:'Business performance measures & cohort metrics', detail:'Growth, margins, customer retention, and churn' },
  { title:'Ownership cap table and decision-makers', detail:'Current share distribution and board approval process' },
  { title:'Company narrative and key risk register', detail:'Draft CIM summary, growth vectors, and legal items' }
];

function ReadinessView({ sellers, selectedSellerId, setSelectedSellerId, readyState, toggleReady, setToast }) {
  const seller=sellers.find(s=>s.id===selectedSellerId)||sellers[0];
  const list=readyState[seller?.id]||[false,false,false,false,false];
  const percent=Math.round((list.filter(Boolean).length/list.length)*100);
  return <div className="view-stack">
    <section className="card readiness-hero">
      <div className="readiness-top">
        <div><span className="control-label">PREPARATION TRACKER</span><h2>Get the company ready for institutional review</h2><p>Track key documentation, owners, and target dates in one workspace.</p></div>
        <CustomSellerSelect
          sellers={sellers}
          selectedSellerId={seller?.id}
          onSelect={setSelectedSellerId}
          label="Active Seller"
        />
      </div>
      <div className="readiness-progress-row"><div className="readiness-number"><strong>{percent}%</strong><span>ready</span></div><div className="readiness-progress-main"><div className="readiness-progress-label"><strong>{list.filter(Boolean).length} of {list.length} items complete</strong><span>Target launch: Nov 18, 2026</span></div><ProgressBar value={percent} color="teal"/><small>{percent===100?'All checklist items are complete. A person still needs to approve launch.':'Complete the open items to move toward a buyer-ready package.'}</small></div><button className="button button-secondary" onClick={()=>setToast('Readiness summary copied.')}><Copy size={15}/> Copy status</button></div>
    </section>
    <div className="readiness-grid">
      <section className="card checklist-card"><div className="card-heading"><div><h3>Preparation checklist</h3><p>Each item needs a clear owner before launch</p></div><button className="square-button"><Filter size={15}/></button></div>
        <div className="checklist-items">{readinessItems.map((item,index)=><button className={`checklist-row ${list[index]?'complete':''}`} key={item.title} onClick={()=>toggleReady(seller?.id,index)}><span className={`check-square ${list[index]?'checked':''}`}>{list[index]&&<Check size={13}/>}</span><span className="checklist-copy"><strong>{item.title}</strong><small>{item.detail}</small></span><span className="owner-chip"><Avatar initials={index%2?'JL':'MC'} color={index%2?'lavender':'mint'} size="xs"/>{index%2?'Jordan':'Maya'}</span><span className="due-chip">{list[index]?'Done':index<2?'Oct 15':'Oct 18'}</span><MoreHorizontal size={17} className="muted-icon"/></button>)}</div>
        <button className="add-checklist" onClick={()=>setToast('Checklist customization is available.')}><Plus size={15}/> Add checklist item</button>
      </section>
      <section className="card timeline-card"><div className="card-heading"><div><h3>Milestone timeline</h3><p>Based on the current mandate plan</p></div><CalendarDays size={17} className="muted-icon"/></div>
        <div className="vertical-timeline">
          <div className="timeline-event done"><span className="timeline-dot"><Check size={11}/></span><div><strong>Initial review</strong><small>Oct 8 · Complete</small></div></div>
          <div className="timeline-event done"><span className="timeline-dot"><Check size={11}/></span><div><strong>Leadership goals confirmed</strong><small>Oct 10 · Complete</small></div></div>
          <div className="timeline-event current"><span className="timeline-dot"/><div><strong>Finish company materials</strong><small>Target Oct 28 · In progress</small></div></div>
          <div className="timeline-event"><span className="timeline-dot"/><div><strong>Approve buyer list</strong><small>Target Nov 4</small></div></div>
          <div className="timeline-event"><span className="timeline-dot"/><div><strong>Launch first outreach</strong><small>Target Nov 18</small></div></div>
        </div>
      </section>
    </div>
  </div>;
}

function BlindView({ sellers, selectedSellerId, setSelectedSellerId, terms, blindApproved, setBlindApproved, outreachApproved, setOutreachApproved, blindSent, handleSendBlind, ndaVerified, setNdaVerified, identityApproved, setIdentityApproved, identityDisclosureAuthorized, setIdentityDisclosureAuthorized, setModal, setToast }) {
  const seller=sellers.find(s=>s.id===selectedSellerId)||sellers[0];
  return <div className="view-stack">
    <section className="card blind-banner"><div className="blind-banner-icon"><EyeOff size={20}/></div><div><h3>Share the opportunity without revealing company identity</h3><p>Start with a short, anonymous summary. Reveal identity only after verified NDA and client authorization.</p></div><Badge tone={blindSent?'green':'amber'}>{blindSent?'Sent · demo':'Draft'}</Badge></section>
    <div className="blind-grid">
      <section className="card teaser-card"><div className="card-heading"><div><h3>Anonymous profile</h3><p>Preview exactly what an investor would see</p></div><div className="blind-head-controls"><CustomSellerSelect sellers={sellers} selectedSellerId={seller?.id} onSelect={setSelectedSellerId} label="Select Seller" /><Badge tone="slate">Identity hidden</Badge></div></div>
        <div className="teaser-paper"><div className="teaser-overline"><span className="teaser-logo">N</span><span>Confidential opportunity · {seller?.sector}</span></div><h2>Established {seller?.sector.toLowerCase()} software business</h2><p className="teaser-copy">A growing, founder-led company with recurring revenue and strong customer retention is exploring strategic options.</p><div className="teaser-stats"><div><span>Annual revenue</span><strong>{seller?.revenue}</strong></div><div><span>Revenue growth</span><strong>{seller?.growth}</strong></div><div><span>Customer retention</span><strong>{seller?.retention}</strong></div></div><div className="teaser-tags"><span>{seller?.sector}</span><span>North America</span><span>{seller?.timing==='Active'?'Active process':'Exploring options'}</span></div><div className="teaser-watermark"><EyeOff size={13}/> Company identity not shown</div></div>
        <div className="teaser-approval approval-stack"><label className="approval-check"><input type="checkbox" checked={blindApproved} onChange={e=>setBlindApproved(e.target.checked)}/><span className="fake-check">{blindApproved&&<Check size={12}/>}</span><span><strong>Seller approved this anonymous summary</strong><small>Required before sharing with any investor.</small></span></label><label className="approval-check"><input type="checkbox" checked={outreachApproved} onChange={e=>setOutreachApproved(e.target.checked)}/><span className="fake-check">{outreachApproved&&<Check size={12}/>}</span><span><strong>Banker approved this investor list and outreach</strong><small>Review every recipient before any contact.</small></span></label><button className="button button-primary" disabled={!blindApproved || !outreachApproved || blindSent} onClick={handleSendBlind}><Send size={15}/>{blindSent?'Marked as sent':'Simulate approved outreach'}</button></div>
        <div className="disclosure-gate"><div className="disclosure-title"><LockKeyhole size={15}/><div><strong>Confidential identity disclosure</strong><span>Company identity stays hidden until human checks are complete.</span></div></div><label className="approval-check"><input type="checkbox" checked={ndaVerified} onChange={e=>setNdaVerified(e.target.checked)}/><span className="fake-check">{ndaVerified&&<Check size={12}/>}</span><span><strong>Confidentiality agreement verified</strong><small>Required for each recipient.</small></span></label><label className="approval-check"><input type="checkbox" checked={identityApproved} onChange={e=>setIdentityApproved(e.target.checked)}/><span className="fake-check">{identityApproved&&<Check size={12}/>}</span><span><strong>Seller approved identity release</strong><small>Explicit release gate.</small></span></label><button className="button button-secondary button-small" disabled={!ndaVerified || !identityApproved || identityDisclosureAuthorized} onClick={()=>{setIdentityDisclosureAuthorized(true);setToast('Disclosure authorization recorded.');}}>{identityDisclosureAuthorized?'Authorization recorded':'Record disclosure authorization'}</button></div>
      </section>
      <section className="card terms-card"><div className="card-heading"><div><h3>Interest & early terms</h3><p>Non-binding indications only</p></div><button className="button button-quiet button-small" onClick={()=>setModal({type:'terms'})}><Plus size={14}/> Add response</button></div>
        <div className="terms-table-wrap"><table className="terms-table"><thead><tr><th>Investor</th><th>Early range</th><th>Structure</th><th>Status</th></tr></thead><tbody>{terms.map((term,index)=><tr key={`${term.investor}-${index}`}><td><strong>{term.investor}</strong><small>{term.conditions}</small></td><td>{term.range}</td><td>{term.structure}</td><td><Badge tone={term.status==='Received'?'green':'amber'}>{term.status}</Badge></td></tr>)}</tbody></table></div>
        <div className="seller-terms"><div className="seller-terms-title"><Building2 size={15}/><strong>Seller’s goals</strong><span>Visible to deal team only</span></div><div className="seller-terms-grid"><div><span>Preferred value range</span><strong>$30M–$38M</strong></div><div><span>Structure</span><strong>Majority sale</strong></div><div><span>Timing</span><strong>Complete by Q1</strong></div></div></div>
      </section>
    </div>
  </div>;
}

function OwnInvestments({ setToast }) {
  const [stage,setStage]=useState('All');
  const [screen,setScreen]=useState({ revenue:true, customers:true, founder:false, market:false, mission:true });
  const items=[
    {name:'Lighthouse Health',sector:'Healthcare IT',stage:'Screening',status:'New review',owner:'Maya Chen',fit:'4 of 5',color:'mint'},
    {name:'OpenLedger',sector:'Financial Technology',stage:'Diligence',status:'Evidence review',owner:'Jordan Lee',fit:'5 of 5',color:'lavender'},
    {name:'Fieldnote Commerce',sector:'Commerce Technology',stage:'Passed',status:'Pass · timing',owner:'Maya Chen',fit:'2 of 5',color:'peach'}
  ];
  const shown=items.filter(i=>stage==='All'||i.stage===stage);
  const toggles=[['revenue','Real revenue'],['customers','Paying customers'],['founder','Founder fit'],['market','Clear market edge'],['mission','Mission fit']];
  return <div className="view-stack">
    <div className="callout investment-boundary"><ShieldCheck size={17}/><span><strong>Separate principal track.</strong> Keep Zeon’s balance-sheet investments separate from advisory client mandates.</span></div>
    <div className="stats-strip"><div><span>Opportunities</span><strong>{items.length}</strong></div><div><span>Screening</span><strong>{items.filter(i=>i.stage==='Screening').length}</strong></div><div><span>Diligence</span><strong>{items.filter(i=>i.stage==='Diligence').length}</strong></div><div><span>Passed</span><strong>{items.filter(i=>i.stage==='Passed').length}</strong></div></div>
    <div className="own-grid">
      <section className="card own-pipeline"><div className="card-heading"><div><h3>Investment opportunities</h3><p>Principal screening</p></div><button className="button button-quiet button-small" onClick={()=>setToast('New investment form available.')}><Plus size={14}/> Add opportunity</button></div><div className="segmented own-filters">{['All','Screening','Diligence','Passed'].map(s=><button className={stage===s?'selected':''} key={s} onClick={()=>setStage(s)}>{s}</button>)}</div>
        <div className="own-opportunity-list">{shown.map(item=><div className="own-opportunity" key={item.name}><Avatar initials={item.name.split(' ').map(x=>x[0]).join('')} color={item.color}/><div className="own-main"><strong>{item.name}</strong><span>{item.sector} · {item.owner}</span></div><div className="own-fit"><span>Screen fit</span><strong>{item.fit}</strong></div><Badge tone={item.stage==='Passed'?'slate':item.stage==='Diligence'?'blue':'amber'}>{item.stage}</Badge><button className="icon-button" onClick={()=>setToast(`${item.name}: review opened.`)}><ChevronRight size={16}/></button></div>)}</div>
      </section>
      <section className="card screen-card"><div className="card-heading"><div><h3>Quick screen</h3><p>Evidence review</p></div><Sparkles size={18} className="accent-icon"/></div><div className="screen-checklist">{toggles.map(([id,label])=><label className="screen-check" key={id}><input type="checkbox" checked={screen[id]} onChange={e=>setScreen({...screen,[id]:e.target.checked})}/><span className="fake-check">{screen[id]&&<Check size={12}/>}</span><span>{label}</span><span className="screen-state">{screen[id]?'Evidence noted':'To review'}</span></label>)}</div><div className="investment-decision"><strong>Human decision required</strong><span>Investment committee vote required.</span><div><button className="button button-quiet button-small" onClick={()=>setToast('Pass recorded.')}>Pass</button><button className="button button-secondary button-small" onClick={()=>setToast('Evidence requested.')}>Request evidence</button><button className="button button-primary button-small" onClick={()=>setToast('Advanced to committee discussion.')}>Advance</button></div></div></section>
    </div>
  </div>;
}

/* ==========================================================================
   INITIATE DEAL MODAL (MATCHMAKING -> ONGOING DEALS)
   ========================================================================== */

function InitiateDealModal({ modal, sellers, investors, onClose, onConfirm }) {
  const [selectedSellerId, setSelectedSellerId] = useState(modal.seller?.id || sellers[0]?.id);
  const [selectedInvestorId, setSelectedInvestorId] = useState(modal.investor?.id || investors[0]?.id);
  const [dealSize, setDealSize] = useState(modal.dealSize || '$45M – $55M Valuation');
  const [leadBanker, setLeadBanker] = useState(modal.leadBanker || 'Maya Chen');
  const [stage, setStage] = useState(modal.stage || 'Outreach & NDA');
  const [notes, setNotes] = useState(modal.notes || '');

  const activeSeller = sellers.find(s => s.id === selectedSellerId) || sellers[0];
  const activeInvestor = investors.find(i => i.id === selectedInvestorId) || investors[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeSeller || !activeInvestor) return;
    onConfirm({
      seller: activeSeller,
      investor: activeInvestor,
      dealSize: dealSize.trim() || '$40M–$50M Valuation',
      leadBanker,
      stage,
      notes: notes.trim()
    });
  };

  return <div className="modal-scrim" onClick={onClose}><div className="modal-card deal-initiate-modal" onClick={e=>e.stopPropagation()}>
    <div className="modal-heading">
      <div>
        <span className="control-label">TRANSACTION MANDATE</span>
        <h2>Initiate Ongoing Deal</h2>
        <p>Match seller with investor and launch live diligence workflow.</p>
      </div>
      <button className="icon-button" onClick={onClose} aria-label="Close modal"><X size={18}/></button>
    </div>

    <div className="deal-concurrent-notice">
      <ShieldCheck size={16} />
      <span>
        <strong>Concurrent Mandates Enabled:</strong> A seller or investor can maintain multiple ongoing transactions in parallel.
      </span>
    </div>

    <form onSubmit={handleSubmit}>
      <div className="deal-parties-preview">
        <div className="deal-party-box seller-party-box">
          <span className="party-role-tag">SELLER (TARGET)</span>
          <div className="party-select-field">
            <select value={selectedSellerId} onChange={e=>setSelectedSellerId(e.target.value)}>
              {sellers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.revenue} · {s.sector})</option>)}
            </select>
          </div>
          {activeSeller && <div className="party-details-mini">
            <CompanyLogo name={activeSeller.name} initials={activeSeller.initials} size="sm" />
            <div>
              <strong>{activeSeller.name}</strong>
              <span>{activeSeller.sector} · Rev: {activeSeller.revenue}</span>
            </div>
          </div>}
        </div>

        <div className="deal-match-bridge">
          <Handshake size={20} />
          <span>MATCH</span>
        </div>

        <div className="deal-party-box investor-party-box">
          <span className="party-role-tag">INVESTOR (BUYER/LP)</span>
          <div className="party-select-field">
            <select value={selectedInvestorId} onChange={e=>setSelectedInvestorId(e.target.value)}>
              {investors.map(i => <option key={i.id} value={i.id}>{i.name} ({i.type} · {i.check})</option>)}
            </select>
          </div>
          {activeInvestor && <div className="party-details-mini">
            <CompanyLogo name={activeInvestor.name} initials={activeInvestor.initials} size="sm" />
            <div>
              <strong>{activeInvestor.name}</strong>
              <span>{activeInvestor.type} · Check: {activeInvestor.check}</span>
            </div>
          </div>}
        </div>
      </div>

      <div className="form-two">
        <label>
          Deal Valuation / Target Size
          <input
            required
            value={dealSize}
            onChange={e=>setDealSize(e.target.value)}
            placeholder="e.g. $45M – $55M Valuation"
          />
        </label>
        <label>
          Lead Deal Banker
          <select value={leadBanker} onChange={e=>setLeadBanker(e.target.value)}>
            <option value="Maya Chen">Maya Chen (Managing Director)</option>
            <option value="Jordan Lee">Jordan Lee (VP, M&A)</option>
            <option value="Elena Rostova">Elena Rostova (Director, Healthcare)</option>
          </select>
        </label>
      </div>

      <div className="form-two">
        <label>
          Initial Pipeline Stage
          <select value={stage} onChange={e=>setStage(e.target.value)}>
            <option value="Outreach & NDA">Outreach & NDA</option>
            <option value="IOI Submitted">IOI Submitted</option>
            <option value="LOI & Exclusivity">LOI & Exclusivity</option>
            <option value="Confirmatory DD">Confirmatory Due Diligence</option>
            <option value="Closing">Closing & Definitive Agreements</option>
          </select>
        </label>
        <label>
          Target Closing Horizon
          <input defaultValue="Q1 2027" placeholder="e.g. 60–90 days" />
        </label>
      </div>

      <label>
        Deal Mandate Notes & Strategic Fit Hypothesis
        <textarea
          rows={3}
          value={notes}
          onChange={e=>setNotes(e.target.value)}
          placeholder="Outline strategic rationale, buyer synergy, exclusivity terms, or specific diligence requirements..."
        />
      </label>

      <div className="modal-actions">
        <button type="button" className="button button-quiet" onClick={onClose}>Cancel</button>
        <button type="submit" className="button button-primary">
          <Handshake size={15}/> Initiate Live Deal
        </button>
      </div>
    </form>
  </div></div>;
}

/* ==========================================================================
   DEAL MILESTONES & DILIGENCE MODAL
   ========================================================================== */

function DealMilestonesModal({ deal, onClose, onToggleMilestone, onAddMilestone, onAdvanceStage, onCloseDeal }) {
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newMilestoneName.trim()) return;
    onAddMilestone(deal.id, newMilestoneName.trim(), newMilestoneDate.trim() || 'Pending');
    setNewMilestoneName('');
    setNewMilestoneDate('');
  };

  const completed = (deal.milestones || []).filter(m => m.done).length;
  const total = (deal.milestones || []).length;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return <div className="modal-scrim" onClick={onClose}><div className="modal-card deal-milestones-modal" onClick={e=>e.stopPropagation()}>
    <div className="modal-heading">
      <div>
        <span className="control-label">DILIGENCE & MILESTONES</span>
        <h2>{deal.title}</h2>
        <p>{deal.dealSize} · Lead Banker: {deal.leadBanker} · Stage: <strong>{deal.stage}</strong></p>
      </div>
      <button className="icon-button" onClick={onClose} aria-label="Close modal"><X size={18}/></button>
    </div>

    <div className="milestones-modal-hero">
      <div className="milestone-progress-bar-wrap">
        <div className="milestone-progress-header">
          <strong>{completed} of {total} Milestones Complete ({progressPct}%)</strong>
          <span>Target Close: {deal.expectedClose}</span>
        </div>
        <ProgressBar value={progressPct} color={progressPct === 100 ? 'green' : 'teal'} />
      </div>

      <div className="milestones-list-interactive">
        {(deal.milestones || []).map((m, idx) => (
          <div key={idx} className={`milestone-item-row ${m.done ? 'milestone-done' : ''}`}>
            <button
              type="button"
              className={`check-square ${m.done ? 'checked' : ''}`}
              onClick={() => onToggleMilestone(deal.id, idx)}
            >
              {m.done && <Check size={13} />}
            </button>
            <div className="milestone-item-info">
              <strong>{m.name}</strong>
              <small>{m.date}</small>
            </div>
            <Badge tone={m.done ? 'green' : 'slate'}>{m.done ? 'Complete' : 'Pending'}</Badge>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="add-milestone-form">
        <input
          placeholder="Add diligence checklist milestone..."
          value={newMilestoneName}
          onChange={e=>setNewMilestoneName(e.target.value)}
        />
        <input
          placeholder="Target date (e.g. Nov 12)"
          value={newMilestoneDate}
          onChange={e=>setNewMilestoneDate(e.target.value)}
          style={{ maxWidth: 160 }}
        />
        <button type="submit" className="button button-secondary button-small">
          <Plus size={14}/> Add
        </button>
      </form>
    </div>

    <div className="deal-milestones-actions">
      <div className="deal-stage-quick-advance">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => { onAdvanceStage(deal.id); onClose(); }}
        >
          <ArrowRight size={15}/> Advance Deal Stage
        </button>
        <button
          type="button"
          className="button button-primary"
          onClick={() => { onCloseDeal(deal); onClose(); }}
        >
          <ClipboardCheck size={15}/> Mark Deal as Closed & Concluded
        </button>
      </div>
      <button type="button" className="button button-quiet" onClick={onClose}>Done</button>
    </div>
  </div></div>;
}

/* ==========================================================================
   ONGOING DEALS VIEW (ACTIVE M&A TRANSACTIONS)
   ========================================================================== */

function OngoingDealsView({ deals, setOngoingDeals, sellers, investors, onAdvanceStage, onCloseDeal, onOpenInitiate, onViewAfterClose, setToast, onUpdateStage }) {
  const [viewMode, setViewMode] = useState('board');
  const [selectedStage, setSelectedStage] = useState('All');
  const [dealSearch, setDealSearch] = useState('');
  const [inspectMilestonesDeal, setInspectMilestonesDeal] = useState(null);
  const [draggedDealId, setDraggedDealId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const stages = [
    { id: 'Outreach & NDA', label: 'Outreach & NDA', dot: 'slate' },
    { id: 'IOI Submitted', label: 'IOI Submitted', dot: 'blue' },
    { id: 'LOI & Exclusivity', label: 'LOI & Exclusivity', dot: 'purple' },
    { id: 'Confirmatory DD', label: 'Confirmatory DD', dot: 'amber' },
    { id: 'Closing', label: 'Closing', dot: 'emerald' }
  ];

  const filtered = useMemo(() => deals.filter(deal => {
    const q = dealSearch.toLowerCase();
    const matchesSearch = !q || [
      deal.title, deal.sellerName, deal.investorName, deal.sellerSector, deal.leadBanker, deal.notes
    ].join(' ').toLowerCase().includes(q);
    const matchesStage = viewMode === 'board' ? true : (selectedStage === 'All' || deal.stage === selectedStage);
    return matchesSearch && matchesStage;
  }), [deals, dealSearch, selectedStage, viewMode]);

  const handleToggleMilestone = (dealId, milestoneIndex) => {
    setOngoingDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      const nextMilestones = (d.milestones || []).map((m, idx) => idx === milestoneIndex ? { ...m, done: !m.done } : m);
      return { ...d, milestones: nextMilestones };
    }));
    setToast('Diligence milestone updated.');
  };

  const handleAddMilestone = (dealId, name, date) => {
    setOngoingDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      return { ...d, milestones: [...(d.milestones || []), { name, done: false, date }] };
    }));
    setToast('Checklist milestone added.');
  };

  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('text/plain', dealId);
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    if (dragOverStage !== stageId) setDragOverStage(stageId);
  };

  const handleDragLeave = (e, stageId) => {
    if (dragOverStage === stageId) setDragOverStage(null);
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    setDragOverStage(null);
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (dealId && onUpdateStage) {
      onUpdateStage(dealId, stageId);
    }
    setDraggedDealId(null);
  };

  return <div className="view-stack">
    {/* Attio View Controls Toolbar */}
    <div className="attio-view-bar">
      <div className="attio-view-bar-left">
        <div className="attio-view-title">
          <Handshake size={16} />
          <span>Ongoing Deals Pipeline</span>
          <span className="attio-view-count-badge">{filtered.length} active transactions</span>
        </div>

        <div className="attio-view-switcher">
          <button
            type="button"
            className={`attio-view-btn ${viewMode === 'board' ? 'active' : ''}`}
            onClick={() => setViewMode('board')}
          >
            <Kanban size={13} />
            <span>Board</span>
          </button>
          <button
            type="button"
            className={`attio-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={13} />
            <span>Grid</span>
          </button>
        </div>
      </div>

      <div className="attio-view-bar-right">
        <div className="attio-search-box">
          <Search size={14} />
          <input
            placeholder="Search ongoing deals, bankers, sectors..."
            value={dealSearch}
            onChange={e => setDealSearch(e.target.value)}
          />
          <kbd>/</kbd>
        </div>

        <button
          type="button"
          className="button button-secondary button-small"
          onClick={onViewAfterClose}
        >
          <ClipboardCheck size={14} /> Closed Deals ({seedClosedDeals.length})
        </button>

        <button
          type="button"
          className="button button-primary button-small"
          onClick={onOpenInitiate}
        >
          <Plus size={15} /> Initiate Deal
        </button>
      </div>
    </div>

    {viewMode === 'board' ? (
      <div className="attio-kanban-board">
        {stages.map(st => {
          const columnDeals = filtered.filter(d => d.stage === st.id);
          const totalVol = sumVolume(columnDeals, 'dealSize');
          const isOver = dragOverStage === st.id;

          return (
            <div
              key={st.id}
              className={`attio-kanban-column ${isOver ? 'drag-over' : ''}`}
              onDragOver={e => handleDragOver(e, st.id)}
              onDragLeave={e => handleDragLeave(e, st.id)}
              onDrop={e => handleDrop(e, st.id)}
            >
              <div className="attio-column-header">
                <div className="attio-column-title-wrap">
                  <span className={`attio-stage-dot ${st.dot}`} />
                  <span className="attio-column-name">{st.label}</span>
                  <span className="attio-column-count">{columnDeals.length}</span>
                </div>
                <div className="attio-column-actions">
                  <span className="attio-column-volume">{totalVol}</span>
                  <button
                    type="button"
                    className="attio-column-add-btn"
                    title={`Initiate deal in ${st.label}`}
                    onClick={onOpenInitiate}
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              <div className="attio-cards-list">
                {columnDeals.map(deal => {
                  const completedMilestones = (deal.milestones || []).filter(m => m.done).length;
                  const totalMilestones = (deal.milestones || []).length;
                  const pct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

                  return (
                    <div
                      key={deal.id}
                      className={`attio-card ${draggedDealId === deal.id ? 'dragging' : ''}`}
                      draggable={true}
                      onDragStart={e => handleDragStart(e, deal.id)}
                      onClick={() => setInspectMilestonesDeal(deal)}
                    >
                      <div className="attio-card-header">
                        <div className="attio-card-title-group">
                          <CompanyLogo name={deal.sellerName} initials={deal.sellerName.slice(0, 2).toUpperCase()} size="sm" />
                          <div className="attio-card-title">{deal.title || `${deal.sellerName} × ${deal.investorName}`}</div>
                        </div>
                      </div>

                      <div className="attio-ongoing-parties">
                        <span style={{ fontWeight: 650, color: '#0f172a', fontSize: '12px' }}>{deal.sellerName}</span>
                        <span className="attio-ongoing-bridge">with</span>
                        <span style={{ fontWeight: 650, color: '#059669', fontSize: '12px' }}>{deal.investorName}</span>
                      </div>

                      <div className="attio-card-pills">
                        <span className="attio-pill attio-pill-rev">
                          <CircleDollarSign size={11} />
                          {deal.dealSize}
                        </span>
                        <span className="attio-pill attio-pill-sector">
                          {deal.sellerSector}
                        </span>
                      </div>

                      <div className="attio-milestone-bar">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                          <span>Diligence milestones</span>
                          <strong style={{ color: '#0f172a' }}>{completedMilestones}/{totalMilestones}</strong>
                        </div>
                        <div className="attio-milestone-progress">
                          <i style={{ width: `${pct}%` }} />
                        </div>
                      </div>

                      <div className="attio-card-footer">
                        <div className="attio-card-owner">
                          <Avatar initials={deal.leadBanker.split(' ').map(x => x[0]).join('').slice(0, 2)} color="mint" size="xs" />
                          <span>{deal.leadBanker}</span>
                        </div>
                        <div className="attio-card-shift-actions" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            className="button button-quiet button-micro"
                            style={{ fontSize: '11px', padding: '2px 7px' }}
                            onClick={() => setInspectMilestonesDeal(deal)}
                          >
                            Milestones
                          </button>
                          <button
                            type="button"
                            className="attio-card-shift-btn"
                            title="Advance deal stage"
                            onClick={() => onAdvanceStage(deal.id)}
                          >
                            <ArrowRight size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {columnDeals.length === 0 && (
                  <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                    No ongoing deals in {st.label}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="attio-column-bottom-add"
                onClick={onOpenInitiate}
              >
                <Plus size={13} /> Initiate deal
              </button>
            </div>
          );
        })}
      </div>
    ) : (
      <>
        <div className="table-controls-strip">
          <div className="segmented-stages-scroll">
            {['All', ...stages.map(s => s.id)].map(st => (
              <button
                key={st}
                className={selectedStage === st ? 'selected' : ''}
                onClick={() => setSelectedStage(st)}
              >
                {st} {st !== 'All' && <small>({deals.filter(d => d.stage === st).length})</small>}
              </button>
            ))}
          </div>
        </div>

        {filtered.length ? (
          <div className="ongoing-deals-grid">
            {filtered.map(deal => {
              const completedMilestones = (deal.milestones || []).filter(m => m.done).length;
              const totalMilestones = (deal.milestones || []).length;
              const pct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
              const stageFlow = ['Outreach & NDA', 'IOI Submitted', 'LOI & Exclusivity', 'Confirmatory DD', 'Closing'];
              const currentStageIdx = stageFlow.indexOf(deal.stage);
              const stagePct = Math.round(((currentStageIdx + 1) / stageFlow.length) * 100);

              return <div className="card ongoing-deal-card" key={deal.id}>
                <div className="deal-card-top">
                  <div className="deal-card-meta-bar">
                    <div className="deal-card-meta-left">
                      <span className="deal-sector-tag">{deal.sellerSector}</span>
                      <span className="deal-meta-sep">•</span>
                      <span className="deal-meta-item">Initiated {deal.initiatedAt}</span>
                      <span className="deal-meta-sep">•</span>
                      <span className="deal-meta-item">Lead: {deal.leadBanker}</span>
                    </div>
                    <div className="deal-top-badges">
                      <span className="deal-size-badge">{deal.dealSize}</span>
                      <Badge tone={deal.stage === 'Closing' ? 'green' : deal.stage === 'Confirmatory DD' ? 'blue' : 'amber'}>
                        {deal.stage}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="deal-card-title">{deal.title}</h3>
                </div>

                <div className="deal-parties-summary-grid">
                  <div className="party-summary-cell seller-cell">
                    <div className="party-cell-label">SELLER / TARGET</div>
                    <div className="party-cell-body">
                      <CompanyLogo name={deal.sellerName} initials={deal.sellerName.slice(0,2).toUpperCase()} size="md" />
                      <div>
                        <strong>{deal.sellerName}</strong>
                        <span>{deal.sellerSector} · {deal.sellerRevenue} Rev</span>
                      </div>
                    </div>
                  </div>

                  <div className="deal-parties-divider" title="Transaction Bridge">
                    <Handshake size={15} />
                  </div>

                  <div className="party-summary-cell investor-cell">
                    <div className="party-cell-label">INVESTOR / BUYER</div>
                    <div className="party-cell-body">
                      <CompanyLogo name={deal.investorName} initials={deal.investorName.slice(0,2).toUpperCase()} size="md" />
                      <div>
                        <strong>{deal.investorName}</strong>
                        <span>{deal.investorType} · {deal.investorCheck}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="deal-stepper-wrap">
                  <div className="deal-stepper-head">
                    <div className="deal-stepper-current">
                      <span>Stage:</span>
                      <strong>{deal.stage}</strong>
                      <span style={{ fontSize: 11, color: '#64748b' }}>({currentStageIdx + 1}/5)</span>
                    </div>
                    <span className="deal-stepper-pct">{stagePct}% of deal flow</span>
                  </div>
                  <div className="deal-stepper-segments">
                    {stageFlow.map((step, sIdx) => {
                      const isDone = sIdx <= currentStageIdx;
                      const isActive = sIdx === currentStageIdx;
                      return (
                        <div
                          key={step}
                          className={`stepper-segment ${isDone ? 'is-done' : ''} ${isActive ? 'is-active' : ''}`}
                          title={`${sIdx + 1}. ${step}`}
                        >
                          <div className="stepper-segment-bar" />
                          <span className="stepper-segment-label">{stageShortNames[sIdx]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="deal-milestones-preview">
                  <div className="milestones-preview-head">
                    <span>Diligence Checklist ({completedMilestones}/{totalMilestones} Complete)</span>
                    <strong>{pct}%</strong>
                  </div>
                  <ProgressBar value={pct} color={pct >= 80 ? 'green' : 'teal'} />
                  <div className="milestones-mini-tags">
                    {(deal.milestones || []).slice(0, 3).map((m, idx) => (
                      <span key={idx} className={`milestone-tag ${m.done ? 'tag-done' : ''}`}>
                        {m.done ? <Check size={11} /> : <Clock3 size={11} />} {m.name}
                      </span>
                    ))}
                    {(deal.milestones || []).length > 3 && (
                      <span className="milestone-tag-more">+{deal.milestones.length - 3} more</span>
                    )}
                  </div>
                </div>

                {deal.notes && (
                  <p className="deal-card-notes">
                    <strong>Mandate context:</strong> {deal.notes}
                  </p>
                )}

                <div className="deal-card-actions">
                  <button
                    className="button button-secondary button-small deal-action-btn"
                    onClick={() => setInspectMilestonesDeal(deal)}
                    title="Diligence & Milestones"
                  >
                    <ClipboardList size={13}/>
                    <span>Diligence & Milestones</span>
                  </button>
                  <button
                    className="button button-quiet button-small deal-action-btn"
                    onClick={() => onAdvanceStage(deal.id)}
                    title="Advance to next stage in transaction flow"
                  >
                    <ArrowRight size={13}/>
                    <span>Advance Stage</span>
                  </button>
                  <button
                    className="button button-primary button-small deal-action-btn deal-action-close"
                    onClick={() => onCloseDeal(deal)}
                    title="Close transaction and move to After the Deal page"
                  >
                    <CheckCircle2 size={13}/>
                    <span>Close Deal</span>
                  </button>
                </div>
              </div>;
            })}
          </div>
        ) : (
          <EmptyState
            title="No ongoing deals match criteria"
            message="Initiate a deal from Matchmaking or click '+ Initiate Deal' above. Multiple concurrent deals per entity are supported."
          />
        )}
      </>
    )}

    {inspectMilestonesDeal && (
      <DealMilestonesModal
        deal={inspectMilestonesDeal}
        onClose={() => setInspectMilestonesDeal(null)}
        onToggleMilestone={handleToggleMilestone}
        onAddMilestone={handleAddMilestone}
        onAdvanceStage={onAdvanceStage}
        onCloseDeal={onCloseDeal}
      />
    )}
  </div>;
}

/* ==========================================================================
   AFTER THE DEAL VIEW (ALL CLOSED TRANSACTIONS & POST-DEAL WORKFLOW)
   ========================================================================== */

function AfterClose({ closedDeals, setClosedDeals, sellers, tasks, toggleTask, setToast }) {
  const [selectedDealId, setSelectedDealId] = useState(closedDeals[0]?.id || null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskWhen, setNewTaskWhen] = useState('30 Days');
  const [newTaskPerson, setNewTaskPerson] = useState('Maya Chen');

  const selectedDeal = closedDeals.find(d => d.id === selectedDealId) || closedDeals[0];

  const toggleDealTask = (dealId, taskId) => {
    setClosedDeals(current => current.map(d => {
      if (d.id !== dealId) return d;
      const updatedTasks = (d.tasks || []).map(t => t.id === taskId ? { ...t, done: !t.done } : t);
      const doneCount = updatedTasks.filter(t => t.done).length;
      const newProgress = updatedTasks.length ? Math.round((doneCount / updatedTasks.length) * 100) : 0;
      return { ...d, tasks: updatedTasks, integrationProgress: newProgress };
    }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedDeal) return;
    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      when: newTaskWhen,
      done: false,
      person: newTaskPerson
    };
    setClosedDeals(current => current.map(d => d.id === selectedDeal.id ? {
      ...d,
      tasks: [...(d.tasks || []), newTask]
    } : d));
    setNewTaskTitle('');
    setToast('Post-close task added.');
  };

  const handleAddEvent = (newEvent) => {
    setClosedDeals(current => current.map(d => d.id === selectedDeal.id ? {
      ...d,
      events: [...(d.events || []), newEvent]
    } : d));
    setScheduleModalOpen(false);
    setToast('Follow-up calendar milestone scheduled.');
  };

  return <div className="view-stack">
    <div className="stats-strip">
      <div><span>All Closed Mandates</span><strong>{closedDeals.length}</strong></div>
      <div><span>Aggregate Value</span><strong>$370M+</strong></div>
      <div><span>Average Integration</span><strong>75%</strong></div>
      <div><span>Active Escrow / TSA</span><strong>{closedDeals.filter(d=>d.escrowEndDate).length} Mandates</strong></div>
    </div>

    {/* SECTION 1: ALL CLOSED DEALS PORTFOLIO */}
    <section className="card closed-portfolio-card">
      <div className="card-heading">
        <div>
          <span className="control-label">PORTFOLIO OVERVIEW</span>
          <h3>All Closed Transactions</h3>
          <p>Click any transaction to open its post-deal workflow, checklists, and calendar.</p>
        </div>
        <Badge tone="green">{closedDeals.length} Closed Transactions</Badge>
      </div>

      <div className="table-wrapper-responsive">
        <table className="closed-deals-table">
          <thead>
            <tr>
              <th>Target Company</th>
              <th>Acquirer / Buyer</th>
              <th>Deal Size</th>
              <th>Close Date</th>
              <th>Deal Lead</th>
              <th>Transition Progress</th>
              <th>Escrow / TSA Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {closedDeals.map(deal => {
              const isSelected = selectedDeal?.id === deal.id;
              return (
                <tr
                  key={deal.id}
                  className={`closed-deal-row ${isSelected ? 'row-selected' : ''}`}
                  onClick={() => setSelectedDealId(deal.id)}
                >
                  <td>
                    <div className="closed-company-cell">
                      <CompanyLogo name={deal.company} initials={deal.company.slice(0, 2).toUpperCase()} size="sm" />
                      <div>
                        <strong>{deal.company}</strong>
                        <span>{deal.sector}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>{deal.buyer}</strong>
                    <small>{deal.type}</small>
                  </td>
                  <td>
                    <strong>{deal.dealSize}</strong>
                    <small>{deal.multiple}</small>
                  </td>
                  <td>{deal.closeDate}</td>
                  <td>
                    <span className="owner-chip">
                      <Avatar initials={deal.dealLead?.split(' ').map(x=>x[0]).join('') || 'MD'} color="lavender" size="xs" isPerson />
                      {deal.dealLead}
                    </span>
                  </td>
                  <td style={{ minWidth: 140 }}>
                    <div className="table-progress-cell">
                      <span>{deal.integrationProgress}%</span>
                      <ProgressBar value={deal.integrationProgress} color={deal.integrationProgress >= 75 ? 'green' : 'teal'} />
                    </div>
                  </td>
                  <td>
                    <Badge tone={deal.status === 'In Integration' ? 'blue' : deal.status === 'TSA Active' ? 'amber' : 'purple'}>
                      {deal.status}
                    </Badge>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`button button-small ${isSelected ? 'button-primary' : 'button-secondary'}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedDealId(deal.id); }}
                    >
                      {isSelected ? 'Viewing' : 'Open Workflow'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>

    {/* SECTION 2: WORKFLOW & PROGRESS FOR SELECTED DEAL */}
    {selectedDeal && (
      <section className="card selected-deal-workflow-card">
        <div className="selected-deal-hero">
          <div className="selected-deal-hero-main">
            <div className="deal-hero-tag">POST-DEAL WORKFLOW & TRANSITION</div>
            <h2>{selectedDeal.company} <span className="acquired-by-text">acquired by</span> {selectedDeal.buyer}</h2>
            <p className="deal-hero-summary">{selectedDeal.summary}</p>
            <div className="deal-hero-meta-row">
              <span className="hero-meta-pill"><strong>Deal Size:</strong> {selectedDeal.dealSize}</span>
              <span className="hero-meta-pill"><strong>Closed:</strong> {selectedDeal.closeDate}</span>
              <span className="hero-meta-pill"><strong>Escrow:</strong> {selectedDeal.escrowAmount}</span>
              <span className="hero-meta-pill"><strong>TSA Horizon:</strong> {selectedDeal.tsaPeriod}</span>
              <span className="hero-meta-pill"><strong>Lead Banker:</strong> {selectedDeal.dealLead}</span>
            </div>
          </div>
          <div className="selected-deal-progress-box">
            <div className="progress-box-pct">{selectedDeal.integrationProgress}%</div>
            <span>Post-Close Transition</span>
            <ProgressBar value={selectedDeal.integrationProgress} color="green" />
          </div>
        </div>

        <div className="afterclose-grid">
          {/* COLUMN 1: CLOSEOUT & TRANSITION CHECKLIST */}
          <div className="closeout-card-container">
            <div className="card-heading">
              <div>
                <h3>Transition & Closeout Checklist</h3>
                <p>Obligations, documentation handoffs, and escrow covenants</p>
              </div>
              <Badge tone="blue">{(selectedDeal.tasks || []).filter(t=>t.done).length} / {(selectedDeal.tasks || []).length} Complete</Badge>
            </div>

            <div className="closeout-tasks-list">
              {(selectedDeal.tasks || []).map(t => (
                <div className={`closeout-row ${t.done ? 'task-completed-row' : ''}`} key={t.id}>
                  <button
                    type="button"
                    className={`check-square ${t.done ? 'checked' : ''}`}
                    onClick={() => toggleDealTask(selectedDeal.id, t.id)}
                  >
                    {t.done && <Check size={13} />}
                  </button>
                  <div className="closeout-task-text">
                    <strong>{t.title}</strong>
                    <span>{t.when} · {t.person}</span>
                  </div>
                  <Badge tone={t.done ? 'green' : 'slate'}>{t.done ? 'Resolved' : 'Pending'}</Badge>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddTask} className="add-closeout-task-form">
              <input
                placeholder="New post-close requirement or audit item..."
                value={newTaskTitle}
                onChange={e=>setNewTaskTitle(e.target.value)}
              />
              <select value={newTaskWhen} onChange={e=>setNewTaskWhen(e.target.value)} style={{ maxWidth: 120 }}>
                <option value="Closing Day">Closing Day</option>
                <option value="30 Days">30 Days</option>
                <option value="60 Days">60 Days</option>
                <option value="90 Days">90 Days</option>
                <option value="180 Days">180 Days</option>
                <option value="365 Days">1 Year</option>
              </select>
              <button type="submit" className="button button-secondary button-small">
                <Plus size={14}/> Add Item
              </button>
            </form>
          </div>

          {/* COLUMN 2: REDESIGNED FOLLOW-UP CALENDAR */}
          <div className="followup-card-container">
            <div className="card-heading">
              <div>
                <h3>Follow-up & Milestone Calendar</h3>
                <p>Scheduled governance check-ins, TSA reviews, and escrow releases</p>
              </div>
              <button
                type="button"
                className="button button-primary button-small"
                onClick={() => setScheduleModalOpen(true)}
              >
                <CalendarDays size={14}/> + Schedule Event
              </button>
            </div>

            <div className="followup-events-list">
              {(selectedDeal.events || []).map(ev => (
                <div className="followup-event-card" key={ev.id}>
                  <div className="followup-calendar-badge">
                    <span className="cal-badge-month">{ev.month}</span>
                    <span className="cal-badge-day">{ev.day}</span>
                  </div>
                  <div className="followup-event-details">
                    <div className="event-details-top">
                      <h4>{ev.title}</h4>
                      <Badge tone={ev.tone || 'amber'}>{ev.status}</Badge>
                    </div>
                    <p>{ev.description}</p>
                    <div className="followup-event-meta">
                      <span className="event-assignee">
                        <Avatar initials={ev.assignee?.split(' ').map(x=>x[0]).join('') || 'MC'} color="mint" size="xs" />
                        {ev.assignee}
                      </span>
                      <span className="event-target-deal">
                        {selectedDeal.company}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="escrow-legal-summary-box">
              <div className="escrow-summary-title">
                <ShieldCheck size={16}/>
                <strong>Escrow & Holdback Schedule</strong>
              </div>
              <div className="escrow-summary-grid">
                <div>
                  <span>Indemnity Escrow</span>
                  <strong>{selectedDeal.escrowAmount}</strong>
                </div>
                <div>
                  <span>Target Release Date</span>
                  <strong>{selectedDeal.escrowEndDate}</strong>
                </div>
                <div>
                  <span>TSA Covenant</span>
                  <strong>{selectedDeal.tsaPeriod}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )}

    {scheduleModalOpen && (
      <ScheduleFollowupModal
        deal={selectedDeal}
        onClose={() => setScheduleModalOpen(false)}
        onSave={handleAddEvent}
      />
    )}
  </div>;
}

/* ==========================================================================
   SCHEDULE FOLLOW-UP CALENDAR EVENT MODAL
   ========================================================================== */

function ScheduleFollowupModal({ deal, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('NOV');
  const [day, setDay] = useState('15');
  const [assignee, setAssignee] = useState('Maya Chen');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('amber');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: `ev-${Date.now()}`,
      month,
      day,
      title: title.trim(),
      assignee,
      tone,
      status: 'Scheduled',
      description: description.trim() || 'Post-closing follow-up milestone.'
    });
  };

  return <div className="modal-scrim" onClick={onClose}><div className="modal-card" onClick={e=>e.stopPropagation()}>
    <div className="modal-heading">
      <div>
        <span className="control-label">CALENDAR SCHEDULER</span>
        <h2>Schedule Post-Close Milestone</h2>
        <p>Mandate: <strong>{deal.company}</strong></p>
      </div>
      <button className="icon-button" onClick={onClose} aria-label="Close modal"><X size={18}/></button>
    </div>

    <form onSubmit={handleSubmit}>
      <label>
        Milestone / Check-in Title
        <input
          required
          placeholder="e.g. 60-Day Working Capital Reconciliation"
          value={title}
          onChange={e=>setTitle(e.target.value)}
        />
      </label>

      <div className="form-two">
        <label>
          Month
          <select value={month} onChange={e=>setMonth(e.target.value)}>
            {['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
        <label>
          Day of Month
          <input
            required
            type="number"
            min="1"
            max="31"
            value={day}
            onChange={e=>setDay(e.target.value)}
          />
        </label>
      </div>

      <div className="form-two">
        <label>
          Assigned Banker
          <select value={assignee} onChange={e=>setAssignee(e.target.value)}>
            <option value="Maya Chen">Maya Chen (Managing Director)</option>
            <option value="Jordan Lee">Jordan Lee (VP, M&A)</option>
            <option value="Elena Rostova">Elena Rostova (Director)</option>
          </select>
        </label>
        <label>
          Milestone Priority / Tone
          <select value={tone} onChange={e=>setTone(e.target.value)}>
            <option value="amber">Upcoming / High Priority (Amber)</option>
            <option value="blue">Operational Milestone (Blue)</option>
            <option value="purple">Governance / Escrow (Purple)</option>
            <option value="green">Final Signoff (Green)</option>
          </select>
        </label>
      </div>

      <label>
        Meeting Agenda / Scope of Review
        <textarea
          rows={3}
          placeholder="Detail what is to be verified (e.g. employee retention, systems migration, escrow claim status)..."
          value={description}
          onChange={e=>setDescription(e.target.value)}
        />
      </label>

      <div className="modal-actions">
        <button type="button" className="button button-quiet" onClick={onClose}>Cancel</button>
        <button type="submit" className="button button-primary">
          <CalendarDays size={15}/> Schedule Follow-Up
        </button>
      </div>
    </form>
  </div></div>;
}


function TasksView({ tasks, toggleTask, setModal, onUpdateStatus }) {
  const [viewMode, setViewMode] = useState('board');
  const [taskSearch, setTaskSearch] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const columns = [
    { id: 'To Do', label: 'To Do', dot: 'slate' },
    { id: 'In Progress', label: 'In Progress', dot: 'blue' },
    { id: 'Review', label: 'In Review', dot: 'amber' },
    { id: 'Done', label: 'Done', dot: 'emerald' }
  ];

  const getTaskStatus = (t) => {
    if (t.status) return t.status;
    if (t.done) return 'Done';
    if (t.due === 'Today' || t.due === 'Overdue') return 'In Progress';
    return 'To Do';
  };

  const filteredTasks = useMemo(() => {
    const q = taskSearch.toLowerCase();
    return tasks.filter(t => !q || [t.title, t.company, t.owner, t.kind, t.due].join(' ').toLowerCase().includes(q));
  }, [tasks, taskSearch]);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (dragOverColumn !== colId) setDragOverColumn(colId);
  };

  const handleDragLeave = (e, colId) => {
    if (dragOverColumn === colId) setDragOverColumn(null);
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId && onUpdateStatus) {
      onUpdateStatus(taskId, colId);
    }
    setDraggedTaskId(null);
  };

  return <div className="view-stack">
    {/* Attio View Controls Toolbar */}
    <div className="attio-view-bar">
      <div className="attio-view-bar-left">
        <div className="attio-view-title">
          <ListChecks size={16} />
          <span>Tasks & Follow-ups</span>
          <span className="attio-view-count-badge">{filteredTasks.length} tasks</span>
        </div>

        <div className="attio-view-switcher">
          <button
            type="button"
            className={`attio-view-btn ${viewMode === 'board' ? 'active' : ''}`}
            onClick={() => setViewMode('board')}
          >
            <Kanban size={13} />
            <span>Board</span>
          </button>
          <button
            type="button"
            className={`attio-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <List size={13} />
            <span>List</span>
          </button>
        </div>
      </div>

      <div className="attio-view-bar-right">
        <div className="attio-search-box">
          <Search size={14} />
          <input
            placeholder="Search tasks, companies, owners..."
            value={taskSearch}
            onChange={e => setTaskSearch(e.target.value)}
          />
          <kbd>/</kbd>
        </div>

        <button
          type="button"
          className="button button-primary button-small"
          onClick={() => setModal({ type: 'task' })}
        >
          <Plus size={15} /> Add Task
        </button>
      </div>
    </div>

    {viewMode === 'board' ? (
      <div className="attio-kanban-board">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => getTaskStatus(t) === col.id);
          const isOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              className={`attio-kanban-column ${isOver ? 'drag-over' : ''}`}
              onDragOver={e => handleDragOver(e, col.id)}
              onDragLeave={e => handleDragLeave(e, col.id)}
              onDrop={e => handleDrop(e, col.id)}
            >
              <div className="attio-column-header">
                <div className="attio-column-title-wrap">
                  <span className={`attio-stage-dot ${col.dot}`} />
                  <span className="attio-column-name">{col.label}</span>
                  <span className="attio-column-count">{colTasks.length}</span>
                </div>
                <button
                  type="button"
                  className="attio-column-add-btn"
                  title={`Add task to ${col.label}`}
                  onClick={() => setModal({ type: 'task' })}
                >
                  <Plus size={13} />
                </button>
              </div>

              <div className="attio-cards-list">
                {colTasks.map(task => {
                  const isDone = task.done || getTaskStatus(task) === 'Done';

                  return (
                    <div
                      key={task.id}
                      className={`attio-card attio-task-card ${draggedTaskId === task.id ? 'dragging' : ''}`}
                      draggable={true}
                      onDragStart={e => handleDragStart(e, task.id)}
                    >
                      <div className="attio-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                          <button
                            type="button"
                            className={`task-check ${isDone ? 'checked' : ''}`}
                            onClick={() => toggleTask(task.id)}
                            style={{ flexShrink: 0 }}
                          >
                            {isDone && <Check size={12} />}
                          </button>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: isDone ? '#94a3b8' : '#0f172a', textDecoration: isDone ? 'line-through' : 'none', lineHeight: 1.3 }}>
                            {task.title}
                          </span>
                        </div>
                      </div>

                      <div className="attio-card-pills">
                        <span className="attio-pill">
                          <Building2 size={11} />
                          {task.company}
                        </span>
                        <span className="attio-pill attio-pill-sector">
                          {task.kind}
                        </span>
                      </div>

                      <div className="attio-card-footer">
                        <div className="attio-card-owner">
                          <Avatar initials={task.owner.split(' ').map(x => x[0]).join('').slice(0, 2)} color="mint" size="xs" />
                          <span>{task.owner}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: task.due === 'Today' ? '#d97706' : '#64748b', fontWeight: task.due === 'Today' ? 700 : 400, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CalendarDays size={12} /> {task.due}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                    No tasks in {col.label}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="attio-column-bottom-add"
                onClick={() => setModal({ type: 'task' })}
              >
                <Plus size={13} /> Add task
              </button>
            </div>
          );
        })}
      </div>
    ) : (
      <section className="card full-card">
        <div className="card-heading">
          <div>
            <h3>Follow-ups and open tasks</h3>
            <p>Assigned owners and due dates</p>
          </div>
          <button className="button button-primary button-small" onClick={() => setModal({ type: 'task' })}>
            <Plus size={15} /> Add task
          </button>
        </div>
        <div className="task-list full-task-list">
          {filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
          ))}
        </div>
      </section>
    )}
  </div>;
}

function TaskItem({ task, toggleTask }) {
  return <div className={`task-item ${task.done?'task-done':''}`}><button className={`task-check ${task.done?'checked':''}`} onClick={()=>toggleTask(task.id)}>{task.done&&<Check size={13}/>}</button><div className="task-copy"><strong>{task.title}</strong><span>{task.company} · {task.kind}</span></div><div className="task-owner"><Avatar initials={task.owner.split(' ').map(x=>x[0]).join('').slice(0,2)} color="mint" size="xs"/>{task.owner}</div><span className={`task-due ${task.due==='Today'?'due-today':''}`}><CalendarDays size={13}/>{task.due}</span><MoreHorizontal size={17} className="muted-icon"/></div>;
}

function SellerDrawer({ seller, investors, onClose, onStage, onOpenInvestor, onDetailProfile, setView }) {
  const [tab,setTab]=useState('Overview');
  const rankedInvestors=[...investors].sort((a,b)=>getInvestorMatchScore(b,seller)-getInvestorMatchScore(a,seller));
  return <div className="drawer-scrim" onClick={onClose}><aside className="seller-drawer" onClick={e=>e.stopPropagation()}>
    <div className="drawer-top"><span className="drawer-label">SELLER LEAD PROFILE</span><div className="drawer-top-actions"><button type="button" className="button button-secondary button-small" onClick={()=>onDetailProfile('seller',seller)}><FileText size={14}/>Detail profile</button><button className="icon-button" onClick={onClose} aria-label="Close seller profile"><X size={18}/></button></div></div>
    <div className="drawer-company"><CompanyLogo name={seller.name} initials={seller.initials} size="lg"/><div><h2>{seller.name}</h2><span>{seller.sector} · {seller.location}</span></div><button className="dots-button"><MoreHorizontal size={18}/></button></div>
    <p className="drawer-summary">{seller.summary}</p>
    <div className="drawer-score-row"><div><span>Fit review</span><strong>{seller.fit}%</strong></div><div className="drawer-fit"><ProgressBar value={seller.fit}/><small>Suggested fit score</small></div></div>
    <div className="drawer-tabs">{['Overview','Readiness','Activity','Matches'].map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}{t==='Matches'&&<small className="tab-count">{rankedInvestors.length}</small>}</button>)}</div>
    {tab==='Overview'&&<div className="drawer-body"><div className="drawer-section-title">Company details</div><div className="drawer-details"><div><span>Revenue</span><strong>{seller.revenue}</strong></div><div><span>Growth</span><strong>{seller.growth}</strong></div><div><span>Retention</span><strong>{seller.retention}</strong></div><div><span>Owner goal</span><strong>{seller.goal}</strong></div><div><span>Timing</span><strong>{seller.timing}</strong></div><div><span>Source</span><strong>{seller.source}</strong></div></div><div className="drawer-section-title">Next step</div><div className="next-step-box"><Clock3 size={15}/><div><strong>{seller.next}</strong><span>Owner: {seller.owner} · updated {seller.updated}</span></div></div><div className="drawer-section-title">Move to stage</div><div className="stage-actions">{['New','Qualified','Nurture','Preparing','In Market'].map(stage=><button key={stage} className={seller.stage===stage?'selected':''} onClick={()=>onStage(stage)}>{stage}</button>)}</div><div className="drawer-section-title drawer-quick-match-title">Top investor matches</div><div className="drawer-match-list drawer-quick-matches">{rankedInvestors.slice(0,3).map((investor,index)=>{const score=getInvestorMatchScore(investor,seller);return <button type="button" className="drawer-match-row" key={investor.id} onClick={()=>onOpenInvestor(investor,seller.id)}><span className="match-rank">{index+1}</span><CompanyLogo name={investor.name} initials={investor.initials} size="md"/><span className="drawer-match-name"><strong>{investor.name}</strong><small>{investor.type} · {investor.check}</small></span><span className="drawer-match-score"><strong>{score}%</strong><ProgressBar value={score} color={score>=85?'teal':'blue'}/></span><ChevronRight size={15}/></button>;})}</div><button type="button" className="drawer-view-all" onClick={()=>setTab('Matches')}>View all investor matches <ArrowRight size={13}/></button></div>}
    {tab==='Readiness'&&<div className="drawer-body"><div className="drawer-section-title">Preparation</div><div className="readiness-compact"><div><strong>{seller.prep}%</strong><span>complete</span></div><ProgressBar value={seller.prep}/></div><button className="button button-secondary wide-button" onClick={()=>{setView('readiness');onClose();}}>Open readiness tracker <ArrowRight size={15}/></button></div>}
    {tab==='Activity'&&<div className="drawer-body"><div className="activity-line"><span className="activity-dot"/><div><strong>Lead profile updated</strong><small>{seller.updated}</small></div></div><div className="activity-line"><span className="activity-dot activity-blue"/><div><strong>Next step: {seller.next}</strong><small>Assigned to {seller.owner}</small></div></div></div>}
    {tab==='Matches'&&<div className="drawer-body"><div className="drawer-section-title">Suggested matching investors</div><div className="drawer-match-list">{rankedInvestors.map((investor,index)=>{const score=getInvestorMatchScore(investor,seller);return <button type="button" className="drawer-match-row" key={investor.id} onClick={()=>onOpenInvestor(investor,seller.id)}><span className="match-rank">{index+1}</span><CompanyLogo name={investor.name} initials={investor.initials} size="md"/><span className="drawer-match-name"><strong>{investor.name}</strong><small>{investor.type} · {investor.check}</small></span><span className="drawer-match-score"><strong>{score}%</strong><ProgressBar value={score} color={score>=85?'teal':'blue'}/></span><ChevronRight size={15}/></button>;})}</div></div>}
    <div className="drawer-footer"><button className="button button-quiet" onClick={onClose}>Close</button><button className="button button-primary" onClick={()=>{setView('matching');onClose();}}>Find matches <ArrowRight size={15}/></button></div>
  </aside></div>;
}

function InvestorDrawer({ investor, sellers, selectedSellerId, setSelectedSellerId, onClose, onOpenSeller, onDetailProfile, setView }) {
  const rankedBusinesses=[...sellers].map(seller=>({seller,score:getInvestorMatchScore(investor,seller)})).sort((a,b)=>b.score-a.score);
  const matchedSeller=sellers.find(seller=>seller.id===selectedSellerId)||rankedBusinesses[0]?.seller;
  const score=getInvestorMatchScore(investor,matchedSeller);
  return <div className="drawer-scrim" onClick={onClose}><aside className="seller-drawer" onClick={e=>e.stopPropagation()}>
    <div className="drawer-top"><span className="drawer-label">INVESTOR PROFILE</span><div className="drawer-top-actions"><button type="button" className="button button-secondary button-small" onClick={()=>onDetailProfile('investor',investor,matchedSeller?.id)}><FileText size={14}/>Detail profile</button><button className="icon-button" onClick={onClose} aria-label="Close investor profile"><X size={18}/></button></div></div>
    <div className="drawer-company"><CompanyLogo name={investor.name} initials={investor.initials} size="lg"/><div><h2>{investor.name}</h2><span>{investor.type} · {investor.status}</span></div></div>
    <p className="drawer-summary">{investor.description}</p>
    <div className="drawer-section-title">Investor preferences</div>
    <div className="drawer-details"><div><span>Typical amount</span><strong>{investor.check}</strong></div><div><span>Geography</span><strong>{investor.geography}</strong></div><div><span>Stages</span><strong>{(investor.stages||[]).join(', ')||'To confirm'}</strong></div><div><span>Last touch</span><strong>{investor.lastTouch}</strong></div></div>
    <div className="drawer-section-title">Sector preferences</div><div className="tag-row investor-profile-tags">{(investor.sectors||[]).map(sector=><span className="soft-tag" key={sector}>{sector}</span>)}</div>
    <div className="investor-business-heading"><div><span className="control-label">SUGGESTED BUSINESS MATCH</span><p>Best-fit seller from sample pipeline</p></div><Badge tone="purple">{score}% fit</Badge></div>
    <div className="drawer-business-select-wrap">
      <span className="drawer-business-select-label">Compare with business:</span>
      <CustomSellerSelect
        sellers={sellers}
        selectedSellerId={matchedSeller?.id}
        onSelect={setSelectedSellerId}
        label="Compare business"
        className="drawer-business-custom-select"
        align="left"
      />
    </div>
    {matchedSeller&&<div className="investor-business-card"><div className="investor-business-top"><CompanyLogo name={matchedSeller.name} initials={matchedSeller.initials} size="md"/><div><strong>{matchedSeller.name}</strong><span>{matchedSeller.sector} · {matchedSeller.stage}</span></div><Badge tone="slate">Seller</Badge></div><p>{matchedSeller.summary}</p><div className="investor-business-facts"><div><span>Revenue</span><strong>{matchedSeller.revenue}</strong></div><div><span>Goal</span><strong>{matchedSeller.goal}</strong></div></div></div>}
    <div className="drawer-footer"><button className="button button-quiet" onClick={()=>matchedSeller&&onOpenSeller(matchedSeller)}>Open seller profile</button><button className="button button-primary" onClick={()=>{setView('matching');onClose();}}>Matching workspace <ArrowRight size={15}/></button></div>
  </aside></div>;
}

/* ==========================================================================
   MODAL COMPONENT (NEW LEADS, SELLERS, INVESTORS, TASKS, TERMS)
   ========================================================================== */

function Modal({ modal, onClose, onAddSeller, onAddInvestor, onAddTerm, onAddTask, onAddLead }) {
  const [form,setForm]=useState({});
  const update=(key,value)=>setForm(old=>({...old,[key]:value}));
  const title = modal.type==='inbound-lead'
    ? 'Simulate Inbound Form Submission'
    : modal.type==='seller' ? 'Add seller lead'
    : modal.type==='investor' ? 'Add investor profile'
    : modal.type==='terms' ? 'Record early terms' : 'Add task';

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(modal.type==='inbound-lead') onAddLead(form);
    else if(modal.type==='seller') onAddSeller(form);
    else if(modal.type==='investor') onAddInvestor(form);
    else if(modal.type==='terms') onAddTerm(form);
    else if(modal.type==='task') onAddTask(form);
  };

  return <div className="modal-scrim" onClick={onClose}><div className="modal-card" onClick={e=>e.stopPropagation()}>
    <div className="modal-heading">
      <div><span className="control-label">WORKSPACE FORM</span><h2>{title}</h2></div>
      <button className="icon-button" onClick={onClose}><X size={18}/></button>
    </div>

    <form onSubmit={handleSubmit}>
      {modal.type==='inbound-lead'&&<>
        <div className="form-two">
          <label>Company / Organization Name<input required value={form.company||''} onChange={e=>update('company',e.target.value)} placeholder="e.g. Apex Health Systems"/></label>
          <label>Contact Name<input required value={form.name||''} onChange={e=>update('name',e.target.value)} placeholder="e.g. Rachel Miller, CEO"/></label>
        </div>
        <div className="form-two">
          <label>Contact Email<input required type="email" value={form.email||''} onChange={e=>update('email',e.target.value)} placeholder="rachel@apexhealth.com"/></label>
          <label>Form Channel
            <select value={form.sourceForm||'Website Sell-Side Form'} onChange={e=>update('sourceForm',e.target.value)}>
              <option value="Website Sell-Side Advisory Form">Website Sell-Side Advisory Form</option>
              <option value="Investor LP & Co-invest Portal">Investor LP & Co-invest Portal</option>
              <option value="Executive Conference Inquiry">Executive Conference Inquiry</option>
              <option value="Partner Network Referral">Partner Network Referral</option>
            </select>
          </label>
        </div>
        <div className="form-two">
          <label>Inbound Type
            <select value={form.suspectedType||'Seller'} onChange={e=>update('suspectedType',e.target.value)}>
              <option value="Seller">Seller Prospect (Company)</option>
              <option value="Investor">Investor Prospect (Fund/LP)</option>
            </select>
          </label>
          <label>Sector
            <select value={form.sector||'Healthcare IT'} onChange={e=>update('sector',e.target.value)}>
              {['Healthcare IT','Financial Technology','Education Technology','Data & Analytics','Commerce Technology','Other'].map(s=><option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <label>Reported Annual Revenue / Check Size<input value={form.revenue||''} onChange={e=>update('revenue',e.target.value)} placeholder="e.g. $22M ARR"/></label>
        <label>Submitted Inbound Message Notes<textarea rows="3" required value={form.notes||''} onChange={e=>update('notes',e.target.value)} placeholder="Describe what the company or fund is looking for..."/></label>
      </>}

      {modal.type==='seller'&&<>
        <label>Company name<input required value={form.name||''} onChange={e=>update('name',e.target.value)} placeholder="Example: Northstar Care"/></label>
        <div className="form-two">
          <label>Sector
            <select value={form.sector||'Healthcare IT'} onChange={e=>update('sector',e.target.value)}>
              {['Healthcare IT','Financial Technology','Education Technology','Data & Analytics','Commerce Technology','Governance, Risk & Compliance','Other'].map(s=><option key={s}>{s}</option>)}
            </select>
          </label>
          <label>Revenue range<input value={form.revenue||''} onChange={e=>update('revenue',e.target.value)} placeholder="$20M–$30M"/></label>
        </div>
        <div className="form-two">
          <label>Lead source<input value={form.source||''} onChange={e=>update('source',e.target.value)} placeholder="Referral, website, event…"/></label>
          <label>Contact Email<input type="email" value={form.email||''} onChange={e=>update('email',e.target.value)} placeholder="founders@company.com"/></label>
        </div>
        <label>What are they looking for?<textarea value={form.goal||''} onChange={e=>update('goal',e.target.value)} placeholder="Sale, raise, acquisition, or early advice" rows="3"/></label>
      </>}

      {modal.type==='investor'&&<>
        <label>Investor name<input required value={form.name||''} onChange={e=>update('name',e.target.value)} placeholder="Example: Cobalt Growth Partners"/></label>
        <div className="form-two">
          <label>Investor type
            <select value={form.type||'Growth Equity'} onChange={e=>update('type',e.target.value)}>
              {['Growth Equity','Private Equity','Venture Capital','Strategic Investor','Credit Provider','Family Office','Other'].map(s=><option key={s}>{s}</option>)}
            </select>
          </label>
          <label>Typical investment amount<input value={form.check||''} onChange={e=>update('check',e.target.value)} placeholder="$10M–$25M"/></label>
        </div>
        <div className="form-two">
          <label>Sector preference
            <select value={form.sector||'Healthcare IT'} onChange={e=>update('sector',e.target.value)}>
              {['Healthcare IT','Financial Technology','Education Technology','Data & Analytics','Commerce Technology','Other'].map(s=><option key={s}>{s}</option>)}
            </select>
          </label>
          <label>Geography<input value={form.geography||''} onChange={e=>update('geography',e.target.value)} placeholder="North America"/></label>
        </div>
        <label>Contact Email<input type="email" value={form.email||''} onChange={e=>update('email',e.target.value)} placeholder="partners@fund.com"/></label>
        <label>Notes<textarea value={form.notes||''} onChange={e=>update('notes',e.target.value)} placeholder="Decision-maker, timing, investment preferences…" rows="3"/></label>
      </>}

      {modal.type==='terms'&&<>
        <label>Investor<input required value={form.investor||''} onChange={e=>update('investor',e.target.value)} placeholder="Investor name"/></label>
        <div className="form-two">
          <label>Early value / amount<input value={form.range||''} onChange={e=>update('range',e.target.value)} placeholder="$25M–$30M"/></label>
          <label>Structure<input value={form.structure||''} onChange={e=>update('structure',e.target.value)} placeholder="Growth equity, debt…"/></label>
        </div>
        <label>Conditions or timing<textarea value={form.conditions||''} onChange={e=>update('conditions',e.target.value)} placeholder="Key requests; non-binding at this stage" rows="3"/></label>
      </>}

      {modal.type==='task'&&<>
        <label>Task name<input required value={form.name||''} onChange={e=>update('name',e.target.value)} placeholder="What needs to happen?"/></label>
        <label>Company<input value={form.company||''} onChange={e=>update('company',e.target.value)} placeholder="Company or investor"/></label>
        <div className="form-two">
          <label>Due date
            <select value={form.due||'Tomorrow'} onChange={e=>update('due',e.target.value)}>
              {['Today','Tomorrow','This week','Next week'].map(d=><option key={d}>{d}</option>)}
            </select>
          </label>
          <label>Owner<input value={form.owner||'Maya Chen'} onChange={e=>update('owner',e.target.value)} placeholder="Task owner"/></label>
        </div>
        <label>Task type<input value={form.kind||'Follow-up'} onChange={e=>update('kind',e.target.value)} placeholder="Follow-up, seller prep…"/></label>
      </>}

      <div className="modal-actions">
        <button type="button" className="button button-quiet" onClick={onClose}>Cancel</button>
        <button type="submit" className="button button-primary"><Check size={15}/> Save</button>
      </div>
    </form>
  </div></div>;
}
