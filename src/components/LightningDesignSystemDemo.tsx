'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  DataTable,
  DataTableCell,
  DataTableColumn,
  Icon,
  IconSettings,
  Input,
  Modal,
  PageHeader,
  PageHeaderControl,
  ProgressBar,
  Radio,
  RadioGroup,
  Textarea,
} from '@salesforce/design-system-react';

const SLDS_STYLESHEET_HREF = '/slds/salesforce-lightning-design-system.min.css';
const SLDS_STYLESHEET_ID = 'slds-demo-stylesheet';
const QUEUE_PAGE_SIZE = 5;

type QueueFilterId = 'all' | 'documents' | 'renewal' | 'callbacks' | 'compliance';

type TicketRow = {
  id: string;
  customer: string;
  service: string;
  counter: string;
  owner: string;
  visitType: 'First-time visit' | 'Returning customer';
  lastVisit: string;
  priorSubmissions: string[];
  priority: 'High' | 'Medium' | 'Low';
  status: 'Ready for review' | 'Documents pending' | 'Needs verification' | 'Awaiting signature' | 'Approved' | 'Follow-up scheduled';
  due: string;
  category: QueueFilterId;
  reviewMins: number;
  docsVerified: number;
  docsRequired: number;
  lastUpdated: string;
  history: string[];
  nextAction: string;
  exceptionState?: string;
};

const initialTickets: TicketRow[] = [
  { id: 'A-1042', customer: 'Mina Patel', service: 'License renewal', counter: 'Counter 4', owner: 'J. Alvarez', visitType: 'Returning customer', lastVisit: 'Visited 8 months ago for address update', priorSubmissions: ['Proof of address', 'State-issued ID'], priority: 'High', status: 'Ready for review', due: '09:10 AM', category: 'renewal', reviewMins: 8, docsVerified: 3, docsRequired: 4, lastUpdated: '2 min ago', history: ['Check-in completed', 'Payment posted by cashier'], nextAction: 'Verify final affidavit and issue renewal' },
  { id: 'A-1036', customer: 'Jacob Chen', service: 'ID replacement', counter: 'Counter 2', owner: 'L. Gomez', visitType: 'First-time visit', lastVisit: 'No previous DMV visit on file', priorSubmissions: [], priority: 'Medium', status: 'Documents pending', due: '09:20 AM', category: 'documents', reviewMins: 11, docsVerified: 2, docsRequired: 4, lastUpdated: '5 min ago', history: ['Photo mismatch flagged', 'Proof of address requested'], nextAction: 'Collect missing address proof' },
  { id: 'A-1028', customer: 'Alicia Gomez', service: 'Vehicle registration', counter: 'Counter 6', owner: 'R. Brooks', visitType: 'Returning customer', lastVisit: 'Visited 2 years ago for title transfer', priorSubmissions: ['Insurance uploaded'], priority: 'Low', status: 'Approved', due: '09:45 AM', category: 'callbacks', reviewMins: 6, docsVerified: 4, docsRequired: 4, lastUpdated: '8 min ago', history: ['VIN verified', 'Insurance uploaded'], nextAction: 'Complete plate handoff' },
  { id: 'A-1021', customer: 'Noah Singh', service: 'Address change', counter: 'Counter 1', owner: 'S. Ortiz', visitType: 'Returning customer', lastVisit: 'Visited 3 months ago for duplicate license', priorSubmissions: ['Proof of address'], priority: 'High', status: 'Needs verification', due: '10:00 AM', category: 'compliance', reviewMins: 13, docsVerified: 2, docsRequired: 4, lastUpdated: '1 min ago', history: ['Fraud rule triggered', 'Supervisor review requested'], nextAction: 'Run secondary identity check' },
  { id: 'A-1017', customer: 'Priya Shah', service: 'Commercial permit', counter: 'Counter 5', owner: 'D. Lee', visitType: 'Returning customer', lastVisit: 'Visited 14 days ago for permit pre-check', priorSubmissions: ['Medical certification', 'State-issued ID', 'Payment confirmation'], priority: 'Medium', status: 'Awaiting signature', due: '10:20 AM', category: 'renewal', reviewMins: 10, docsVerified: 4, docsRequired: 4, lastUpdated: '4 min ago', history: ['Medical certification uploaded', 'Inspector sign-off pending'], nextAction: 'Capture final supervisor signature' },
  { id: 'A-1013', customer: 'Omar Hassan', service: 'License renewal', counter: 'Counter 3', owner: 'M. Diaz', visitType: 'Returning customer', lastVisit: 'Visited 5 years ago for original license issue', priorSubmissions: ['State-issued ID'], priority: 'Low', status: 'Ready for review', due: '10:40 AM', category: 'renewal', reviewMins: 7, docsVerified: 4, docsRequired: 4, lastUpdated: '7 min ago', history: ['Queue moved from kiosk lane'], nextAction: 'Finalize issuance and print receipt' },
  { id: 'A-1009', customer: 'Lena Brooks', service: 'ID replacement', counter: 'Counter 2', owner: 'K. Morgan', visitType: 'First-time visit', lastVisit: 'No previous DMV visit on file', priorSubmissions: ['Name change court order'], priority: 'High', status: 'Needs verification', due: '11:00 AM', category: 'documents', reviewMins: 14, docsVerified: 1, docsRequired: 4, lastUpdated: '3 min ago', history: ['Name mismatch in legacy record'], nextAction: 'Validate legal name change document' },
  { id: 'A-1006', customer: 'Daniel Wu', service: 'Vehicle registration', counter: 'Counter 6', owner: 'R. Brooks', visitType: 'Returning customer', lastVisit: 'Visited 1 week ago for lien release intake', priorSubmissions: ['Lien release scanned', 'Insurance uploaded'], priority: 'Medium', status: 'Ready for review', due: '11:15 AM', category: 'callbacks', reviewMins: 9, docsVerified: 3, docsRequired: 4, lastUpdated: '6 min ago', history: ['Lien release scanned'], nextAction: 'Collect final payment authorization' },
  { id: 'A-1003', customer: 'Sara Ahmed', service: 'Address change', counter: 'Counter 1', owner: 'S. Ortiz', visitType: 'Returning customer', lastVisit: 'Visited yesterday through remote check-in', priorSubmissions: ['Remote address proof', 'Signed affidavit'], priority: 'Low', status: 'Follow-up scheduled', due: '11:35 AM', category: 'compliance', reviewMins: 5, docsVerified: 4, docsRequired: 4, lastUpdated: '9 min ago', history: ['Remote check-in completed'], nextAction: 'Send confirmation summary' },
  { id: 'A-0998', customer: 'Victor Nguyen', service: 'Commercial permit', counter: 'Counter 5', owner: 'D. Lee', visitType: 'Returning customer', lastVisit: 'Visited 10 days ago for inspection intake', priorSubmissions: ['Inspection report uploaded', 'Payment confirmation'], priority: 'High', status: 'Approved', due: '11:50 AM', category: 'compliance', reviewMins: 12, docsVerified: 3, docsRequired: 4, lastUpdated: '2 min ago', history: ['Inspection report uploaded'], nextAction: 'Package permit for dispatch' },
];

const requiredDocuments = ['Proof of address', 'State-issued ID', 'Payment confirmation', 'Signed affidavit'];
const workflowSteps = [
  'Confirm customer identity and address details.',
  'Check all mandatory documents listed in the case panel.',
  'Run compliance check only after document completion.',
  'If a document is missing, reschedule with clear instructions.',
];

export function LightningDesignSystemDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [queuePage, setQueuePage] = useState(1);
  const [tickets, setTickets] = useState<TicketRow[]>(initialTickets);
  const [selectedTicketId, setSelectedTicketId] = useState(initialTickets[0].id);
  const [selectedPriority, setSelectedPriority] = useState('High');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleNote, setRescheduleNote] = useState('Missing required documents');
  const [caseDecision, setCaseDecision] = useState('');
  const [caseDecisionNote, setCaseDecisionNote] = useState('');
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [photoConfirmed, setPhotoConfirmed] = useState(false);
  const [activityLog, setActivityLog] = useState<string[]>([
    'Now serving A-1042 at Counter 4',
    'A-1036 moved to Document queue for missing proof',
  ]);

  useEffect(() => {
    let link = document.getElementById(SLDS_STYLESHEET_ID) as HTMLLinkElement | null;
    const createdHere = !link;
    if (!link) {
      link = document.createElement('link');
      link.id = SLDS_STYLESHEET_ID;
      link.rel = 'stylesheet';
      link.href = SLDS_STYLESHEET_HREF;
      document.head.appendChild(link);
    }
    return () => {
      if (createdHere) {
        document.getElementById(SLDS_STYLESHEET_ID)?.remove();
      }
    };
  }, []);

  const sortedTickets = useMemo(() => {
    const toMinutes = (due: string) => {
      const [time, period] = due.split(' ');
      const [hoursPart, minutesPart] = time.split(':');
      const hours = Number(hoursPart);
      const minutes = Number(minutesPart);
      const normalizedHours = period === 'PM' && hours !== 12 ? hours + 12 : period === 'AM' && hours === 12 ? 0 : hours;
      return normalizedHours * 60 + minutes;
    };
    return [...tickets].sort((a, b) => toMinutes(a.due) - toMinutes(b.due));
  }, [tickets]);

  const pendingTickets = useMemo(
    () => sortedTickets.filter((ticket) => !['Approved', 'Follow-up scheduled'].includes(ticket.status)),
    [sortedTickets]
  );

  const queuePageCount = Math.max(1, Math.ceil(pendingTickets.length / QUEUE_PAGE_SIZE));

  const pagedPendingTickets = useMemo(() => {
    const startIndex = (queuePage - 1) * QUEUE_PAGE_SIZE;
    return pendingTickets.slice(startIndex, startIndex + QUEUE_PAGE_SIZE);
  }, [pendingTickets, queuePage]);

  const activeTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) ?? tickets[0],
    [tickets, selectedTicketId]
  );

  const missingDocuments = useMemo(
    () => requiredDocuments.slice(activeTicket.docsVerified),
    [activeTicket.docsVerified]
  );

  const nextRequiredDocument = missingDocuments[0] ?? null;

  const allDocumentsReady = missingDocuments.length === 0;
  const allCoreChecksConfirmed = identityConfirmed && addressConfirmed && photoConfirmed;
  const canVerifyDocuments = !['Approved', 'Follow-up scheduled'].includes(activeTicket.status);
  const canRunCompliance =
    allDocumentsReady &&
    allCoreChecksConfirmed &&
    ['Ready for review', 'Needs verification', 'Documents pending'].includes(activeTicket.status);
  const canIssueTicket = allDocumentsReady && activeTicket.status === 'Awaiting signature';

  useEffect(() => {
    setSelectedPriority(activeTicket.priority);
  }, [activeTicket.priority]);

  useEffect(() => {
    if (!isQueueModalOpen) return;
    const activeIndex = pendingTickets.findIndex((ticket) => ticket.id === activeTicket.id);
    if (activeIndex >= 0) {
      setQueuePage(Math.floor(activeIndex / QUEUE_PAGE_SIZE) + 1);
      return;
    }
    setQueuePage(1);
  }, [isQueueModalOpen, pendingTickets, activeTicket.id]);

  useEffect(() => {
    if (queuePage > queuePageCount) {
      setQueuePage(queuePageCount);
    }
  }, [queuePage, queuePageCount]);

  useEffect(() => {
    setCaseDecision('');
    setCaseDecisionNote('');
    setIdentityConfirmed(false);
    setAddressConfirmed(false);
    setPhotoConfirmed(false);
  }, [activeTicket.id]);

  const processProgress = useMemo(() => {
    const docsStep = activeTicket.docsVerified >= activeTicket.docsRequired ? 100 : Math.round((activeTicket.docsVerified / activeTicket.docsRequired) * 100);
    const verificationStep = activeTicket.status === 'Needs verification' || activeTicket.status === 'Documents pending' ? 40 : 100;
    const signatureStep = activeTicket.status === 'Awaiting signature' ? 60 : activeTicket.status === 'Approved' || activeTicket.status === 'Follow-up scheduled' ? 100 : 20;
    const completionStep = activeTicket.status === 'Approved' || activeTicket.status === 'Follow-up scheduled' ? 100 : 20;

    return [
      { name: 'Check-in and queue intake', value: 100 },
      { name: 'Document verification', value: docsStep },
      { name: 'Identity and compliance review', value: verificationStep },
      { name: 'Signature and payment finalization', value: signatureStep },
      { name: 'Issue result and close ticket', value: completionStep },
    ];
  }, [activeTicket]);

  const workflowStepStates = useMemo(() => {
    const showRescheduleStep = !allDocumentsReady || activeTicket.status === 'Follow-up scheduled';

    const stepCompletion = [
      identityConfirmed && addressConfirmed,
      allDocumentsReady,
      activeTicket.status === 'Awaiting signature' || activeTicket.status === 'Approved' || activeTicket.status === 'Follow-up scheduled',
      activeTicket.status === 'Follow-up scheduled',
    ];

    const firstIncompleteIndex = stepCompletion.findIndex((isDone) => !isDone);

    return workflowSteps.map((label, index) => ({ label, index }))
      .filter((step) => showRescheduleStep || step.index !== 3)
      .map((step) => {
      const { label, index } = step;

      if (stepCompletion[index]) {
        return { label, status: 'done' as const, statusLabel: 'Done' };
      }

      if (index === 1 && stepCompletion[0] && !allDocumentsReady) {
        return { label, status: 'blocked' as const, statusLabel: 'Missing docs' };
      }

      if (firstIncompleteIndex === -1 || index === firstIncompleteIndex) {
        return { label, status: 'current' as const, statusLabel: 'In progress' };
      }

      return { label, status: 'pending' as const, statusLabel: 'Pending' };
    });
  }, [identityConfirmed, addressConfirmed, allDocumentsReady, activeTicket.status]);

  const statusBadgeTone = useMemo(() => {
    switch (activeTicket.priority) {
      case 'High':
        return 'slds-theme_error';
      case 'Medium':
        return 'slds-theme_warning';
      default:
        return 'slds-theme_success';
    }
  }, [activeTicket.priority]);

  const workflowBadge = useMemo(() => {
    if (activeTicket.status === 'Approved') {
      return { label: 'Ticket completed', tone: 'slds-theme_success' };
    }

    if (activeTicket.status === 'Follow-up scheduled') {
      return { label: 'Follow-up scheduled', tone: 'slds-theme_warning' };
    }

    if (!allDocumentsReady) {
      return { label: 'Missing required documents', tone: 'slds-theme_warning' };
    }

    if (!allCoreChecksConfirmed) {
      return { label: 'Complete confirmations', tone: 'slds-theme_warning' };
    }

    if (canIssueTicket) {
      return { label: 'Ready for issuance', tone: 'slds-theme_success' };
    }

    if (canRunCompliance) {
      return { label: 'Ready for compliance review', tone: 'slds-theme_success' };
    }

    if (activeTicket.status === 'Awaiting signature') {
      return { label: 'Awaiting signature', tone: 'slds-theme_warning' };
    }

    return { label: 'Case review in progress', tone: 'slds-theme_warning' };
  }, [activeTicket.status, allDocumentsReady, allCoreChecksConfirmed, canIssueTicket, canRunCompliance]);

  const logAction = (entry: string) => setActivityLog((prev) => [entry, ...prev].slice(0, 8));

  const updateTicket = (ticketId: string, patch: Partial<TicketRow>, logLine: string) => {
    setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, ...patch } : ticket)));
    logAction(logLine);
  };

  const handleOpenQueueTicket = (ticket: TicketRow) => {
    setSelectedTicketId(ticket.id);
    logAction(`Switched to ${ticket.id} at ${ticket.counter} (${ticket.customer})`);
    setIsQueueModalOpen(false);
  };

  const handleVerifyDocuments = () => {
    const nextCount = Math.min(activeTicket.docsVerified + 1, activeTicket.docsRequired);
    const nextStatus = nextCount === activeTicket.docsRequired ? 'Ready for review' : activeTicket.status;
    updateTicket(activeTicket.id, {
      docsVerified: nextCount,
      status: nextStatus,
      nextAction: nextCount === activeTicket.docsRequired ? 'Run compliance review and route to signature' : activeTicket.nextAction,
      lastUpdated: 'just now',
      history: [`Document ${nextCount}/${activeTicket.docsRequired} verified`, ...activeTicket.history].slice(0, 5),
    }, `${activeTicket.id}: document verification updated (${nextCount}/${activeTicket.docsRequired})`);
  };

  const handleComplianceCheck = () => {
    if (!allDocumentsReady || !allCoreChecksConfirmed) {
      logAction(`${activeTicket.id}: compliance blocked (complete confirmations and required documents first)`);
      return;
    }
    updateTicket(activeTicket.id, {
      status: 'Awaiting signature',
      nextAction: 'Collect supervisor signature and finalize payment',
      lastUpdated: 'just now',
      history: ['Compliance check passed', ...activeTicket.history].slice(0, 5),
    }, `${activeTicket.id}: compliance review completed`);
  };

  const handleEverythingChecksOut = () => {
    handleComplianceCheck();
  };

  const handleCloseTicket = () => {
    if (!allDocumentsReady || activeTicket.status !== 'Awaiting signature') {
      logAction(`${activeTicket.id}: issuance blocked (run compliance and collect signature first)`);
      return;
    }
    updateTicket(activeTicket.id, {
      status: 'Approved',
      nextAction: 'Issue receipt and archive ticket',
      lastUpdated: 'just now',
      history: ['Credential issued and ticket closed', ...activeTicket.history].slice(0, 5),
    }, `${activeTicket.id}: ticket closed as approved`);
  };

  const handleEscalate = () => {
    updateTicket(activeTicket.id, {
      status: 'Needs verification',
      nextAction: 'Supervisor escalation required',
      lastUpdated: 'just now',
      exceptionState: 'Sent to supervisor review',
      history: ['Escalated to supervisor', ...activeTicket.history].slice(0, 5),
    }, `${activeTicket.id}: escalated for supervisor review`);
  };

  const handleSubmitReview = () => {
    updateTicket(activeTicket.id, {
      status: selectedPriority === 'High' ? 'Needs verification' : activeTicket.status,
      lastUpdated: 'just now',
      history: [`Supervisor review submitted (${selectedPriority} priority)`, ...activeTicket.history].slice(0, 5),
    }, `${activeTicket.id}: review submitted (${selectedPriority} priority)`);
    setIsModalOpen(false);
  };

  const handleRescheduleCase = () => {
    const scheduleLabel = rescheduleDate.trim() ? rescheduleDate.trim() : 'next available slot';
    const noteLabel = rescheduleNote.trim() ? rescheduleNote.trim() : 'Missing documents';
    updateTicket(activeTicket.id, {
      status: 'Follow-up scheduled',
      nextAction: 'Return with missing documents and continue case review',
      lastUpdated: 'just now',
      exceptionState: `Rescheduled: ${scheduleLabel}`,
      history: [`Rescheduled to ${scheduleLabel} (${noteLabel})`, ...activeTicket.history].slice(0, 5),
    }, `${activeTicket.id}: case rescheduled (${scheduleLabel})`);
    setCaseDecision('');
    setCaseDecisionNote('');
    setIsRescheduleModalOpen(false);
  };

  const handleConfirmDecision = () => {
    if (!caseDecision) {
      logAction(`${activeTicket.id}: select a decision before confirming`);
      return;
    }

    if (caseDecision === 'reschedule') {
      setIsRescheduleModalOpen(true);
      return;
    }

    if (caseDecision === 'escalate') {
      handleEscalate();
      return;
    }

    if (caseDecision === 'hold') {
      const note = caseDecisionNote.trim() || 'No interaction possible at counter';
      updateTicket(activeTicket.id, {
        status: 'Needs verification',
        nextAction: 'Case flagged for manual follow-up',
        lastUpdated: 'just now',
        exceptionState: 'Held for follow-up',
        history: [`Case flagged: ${note}`, ...activeTicket.history].slice(0, 5),
      }, `${activeTicket.id}: flagged as no-action case`);
      setCaseDecision('');
      setCaseDecisionNote('');
    }
  };

  const QueueActionCell = (props: { item?: TicketRow }) => {
    const ticket = props.item;
    if (!ticket) {
      return <DataTableCell {...props} />;
    }

    return (
      <DataTableCell {...props}>
        {ticket.id === activeTicket.id ? (
          <span className="slds-badge slds-theme_success">Current ticket</span>
        ) : (
          <Button label="Open ticket" variant="neutral" onClick={() => handleOpenQueueTicket(ticket)} />
        )}
      </DataTableCell>
    );
  };
  QueueActionCell.displayName = DataTableCell.displayName;

  return (
    <IconSettings iconPath="/icons">
      <div
        className="dmv-demo-topbar fixed top-0 left-0 right-0 z-[100] h-14 sm:h-16 px-4 sm:px-6 md:px-14 flex items-center justify-between"
      >
        <Link href="/" className="slds-text-title_caps slds-text-link_reset">
          Akhil Vanga
        </Link>
        <Link href="/work/design-system-migration" className="slds-text-body_small slds-text-link_reset">
          Back to case study
        </Link>
      </div>
      <style jsx global>{`
        .dmv-demo-root {
          background: var(--slds-g-color-neutral-base-100, #ffffff);
          color: var(--slds-g-color-neutral-base-10, #181818);
          font-family: 'Salesforce Sans', Arial, sans-serif;
          min-height: 100vh;
          padding-top: 72px;
        }

        .dmv-demo-shell {
          max-width: 1728px;
          margin: 0 auto;
          padding: 24px 32px 40px;
        }

        .dmv-layout {
          display: grid;
          grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);
          gap: 16px;
          align-items: start;
        }

        .dmv-workflow-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
          gap: 16px;
          align-items: start;
        }

        .dmv-demo-topbar {
          background: rgba(255, 255, 255, 0.97);
          border-bottom: 1px solid var(--slds-g-color-border-base-1, #d8dde6);
          backdrop-filter: blur(20px);
        }

        .queue-modal__container {
          width: min(92vw, 1120px) !important;
          max-width: 1120px !important;
          min-width: min(92vw, 720px) !important;
        }

        .queue-modal__content {
          max-height: min(70vh, 760px);
          overflow: hidden;
        }

        .queue-modal__table-shell {
          overflow-x: auto;
        }

        .queue-modal__table-shell .slds-table_header-fixed_container,
        .queue-modal__table-shell .slds-table_header-fixed_scroller {
          height: min(52vh, 560px) !important;
        }

        .foundation-card {
          height: 100%;
        }

        .foundation-card .slds-card__body {
          margin-top: 0;
          margin-bottom: 0;
        }

        .foundation-tile {
          width: 100%;
          height: 100%;
          padding: 16px;
          border: 1px solid var(--slds-g-color-border-base-1, #c9c9c9);
          border-radius: 0.5rem;
          background: linear-gradient(180deg, var(--slds-g-color-neutral-base-95, #f7f9fc) 0%, var(--slds-g-color-neutral-base-100, #ffffff) 100%);
        }

        .workflow-steps-list {
          margin-top: 12px;
          padding-left: 0 !important;
          list-style: none;
          counter-reset: workflow-step;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px 12px;
        }

        .workflow-steps-list li {
          position: relative;
          margin: 0;
          padding: 8px 10px 8px 36px;
          border: 1px solid var(--slds-g-color-border-base-1, #d8dde6);
          border-radius: 0.25rem;
          background: var(--slds-g-color-neutral-base-100, #ffffff);
          font-size: 0.875rem;
          line-height: 1.45;
        }

        .workflow-step-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .workflow-step-item .workflow-step-label {
          flex: 1;
          min-width: 0;
        }

        .workflow-step-indicator {
          flex-shrink: 0;
          margin-top: 1px;
          font-size: 0.6875rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .workflow-steps-list li::before {
          counter-increment: workflow-step;
          content: counter(workflow-step);
          position: absolute;
          left: 10px;
          top: 9px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1px solid var(--slds-g-color-border-base-1, #d8dde6);
          color: var(--slds-g-color-neutral-base-50, #747474);
          font-size: 0.6875rem;
          line-height: 16px;
          text-align: center;
          font-weight: 700;
        }

        .workflow-step-done {
          border-color: var(--slds-g-color-success-base-50, #2e844a);
        }

        .workflow-step-current {
          border-color: var(--slds-g-color-brand-base-50, #0176d3);
          background: var(--slds-g-color-brand-base-95, #eef4ff);
        }

        .workflow-step-blocked {
          border-color: var(--slds-g-color-warning-base-50, #a96404);
          background: var(--slds-g-color-warning-base-95, #fef1e9);
        }

        .workflow-step-done::before {
          border-color: var(--slds-g-color-success-base-50, #2e844a);
          color: var(--slds-g-color-success-base-50, #2e844a);
        }

        .workflow-step-current::before {
          border-color: var(--slds-g-color-brand-base-50, #0176d3);
          color: var(--slds-g-color-brand-base-50, #0176d3);
        }

        .workflow-step-blocked::before {
          border-color: var(--slds-g-color-warning-base-50, #a96404);
          color: var(--slds-g-color-warning-base-50, #a96404);
        }

        .workflow-missing-note {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--slds-g-color-border-base-1, #d8dde6);
        }

        .dmv-step-header {
          gap: 0.5rem;
        }

        .dmv-primary-actions {
          gap: 0.5rem;
        }

        .dmv-primary-action-slot {
          min-height: 32px;
          display: flex;
          align-items: center;
        }

        .case-meta-list {
          border: 1px solid var(--slds-g-color-border-base-1, #d8dde6);
          border-radius: 0.375rem;
          background: var(--slds-g-color-neutral-base-100, #ffffff);
        }

        .case-meta-row {
          display: grid;
          grid-template-columns: 136px minmax(0, 1fr);
          gap: 12px;
          padding: 10px 12px;
          border-bottom: 1px solid var(--slds-g-color-border-base-1, #d8dde6);
          align-items: start;
        }

        .case-meta-row:last-child {
          border-bottom: 0;
        }

        .case-meta-label {
          margin: 0;
          color: var(--slds-g-color-neutral-base-50, #747474);
          font-size: 0.6875rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1.4;
        }

        .case-meta-value {
          margin: 0;
          color: var(--slds-g-color-neutral-base-10, #181818);
          font-size: 0.875rem;
          line-height: 1.35;
          font-weight: 500;
        }

        .case-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--slds-g-color-border-base-1, #d8dde6);
        }

        .case-doc-list {
          display: grid;
          gap: 8px;
          margin-top: 8px;
        }

        .supervisor-modal__content {
          padding: 16px !important;
        }

        .supervisor-modal__footer-wrap {
          display: flex;
          justify-content: flex-end;
          padding: 16px;
        }

        .supervisor-timeline-card .slds-card__body {
          margin-top: 8px;
          margin-bottom: 0;
        }

        .supervisor-timeline-list {
          padding: 0 16px 16px;
        }

        .supervisor-notify-checkbox .slds-form-element__label {
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .dmv-demo-root {
            padding-top: 64px;
          }

          .dmv-layout,
          .dmv-workflow-grid {
            grid-template-columns: 1fr !important;
          }

          .dmv-demo-shell {
            padding: 16px;
          }

          .slds-breadcrumb {
            display: none;
          }

          .slds-page-header {
            padding: 0.75rem;
          }

          .slds-page-header__row {
            display: flex;
            flex-wrap: wrap;
            row-gap: 0.75rem;
          }

          .slds-page-header__col-title,
          .slds-page-header__col-meta,
          .slds-page-header__col-actions {
            width: 100% !important;
            min-width: 0 !important;
            flex: 1 1 100% !important;
          }

          .slds-page-header__name,
          .slds-page-header__name-title,
          .slds-page-header__name-title h1 {
            min-width: 0 !important;
            width: 100% !important;
          }

          .slds-page-header__name-title h1 {
            display: block !important;
            line-height: 1.25;
          }

          .slds-page-header__name-title h1 > span:first-child {
            display: none !important;
          }

          .slds-page-header__name-title .slds-page-header__title {
            display: block !important;
            width: auto !important;
            max-width: 100% !important;
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: unset !important;
            line-height: 1.25;
          }

          .slds-page-header__col-actions {
            width: 100%;
          }

          .slds-page-header__controls,
          .slds-page-header__control {
            width: 100% !important;
            display: block !important;
          }

          .dmv-header-actions {
            width: 100%;
            display: grid !important;
            grid-template-columns: 1fr;
            gap: 0.5rem;
            align-items: stretch;
            justify-items: stretch;
          }

          .dmv-header-actions .slds-button {
            width: 100%;
          }

          .dmv-header-actions .slds-button + .slds-button {
            margin-left: 0 !important;
          }

          .workflow-steps-list {
            grid-template-columns: 1fr;
          }

          .workflow-step-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .workflow-step-indicator {
            margin-top: 0.25rem;
          }

          .dmv-step-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .dmv-primary-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .dmv-primary-action-slot {
            width: 100%;
          }

          .dmv-primary-action-slot .slds-button {
            width: 100%;
          }

          .case-meta-row {
            grid-template-columns: 1fr;
            gap: 4px;
          }

          .queue-modal__container {
            width: 96vw !important;
            min-width: 96vw !important;
            max-width: 96vw !important;
          }

          .queue-modal__content {
            max-height: 72vh;
          }

          .queue-modal__table-shell .slds-table_header-fixed_container,
          .queue-modal__table-shell .slds-table_header-fixed_scroller {
            height: min(46vh, 420px) !important;
          }

          .supervisor-notify-checkbox .slds-form-element__label {
            white-space: normal;
          }

          .supervisor-modal__content {
            padding: 8px !important;
          }

          .supervisor-modal__footer-wrap {
            padding: 8px;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .dmv-demo-shell {
            padding: 24px;
          }

          .dmv-layout,
          .dmv-workflow-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 1025px) and (max-width: 1366px) {
          .dmv-demo-shell {
            padding: 24px;
          }

          .dmv-workflow-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dmv-demo-root slds-theme_default">
        <div className="dmv-demo-shell">
          <Breadcrumb
            trail={[
              <a key="home" href="/">Home</a>,
              <a key="ops" href="/work/design-system-migration/demo">DMV Operations</a>,
              <span key="portal" style={{ paddingLeft: '0.5rem' }}>Employee Portal</span>,
            ]}
          />

          <PageHeader
            title="DMV Ticket Processing Console"
            variant="object-home"
            label="Case handling workflow"
            onRenderActions={() => (
              <PageHeaderControl>
                <div className="slds-grid slds-grid_vertical-align-center dmv-header-actions" style={{ gap: '0.5rem' }}>
                  <Button label="Current queue" variant="neutral" onClick={() => setIsQueueModalOpen(true)} />
                  <Button label="Supervisor notes" variant="brand" onClick={() => setIsModalOpen(true)} />
                </div>
              </PageHeaderControl>
            )}
          />

          <Card heading={`Now serving ${activeTicket.id}`} icon={<Icon category="standard" name="case" />} className="slds-m-top_medium">
            <div className="slds-p-around_medium slds-grid slds-wrap slds-gutters_x-small" style={{ alignItems: 'stretch' }}>
              <div className="slds-col slds-size_1-of-1 slds-medium-size_2-of-12" style={{ display: 'flex' }}>
                <div className="foundation-tile">
                  <p className="slds-text-title_caps">Ticket</p>
                  <p className="slds-text-heading_small slds-m-top_x-small">{activeTicket.id}</p>
                </div>
              </div>
              <div className="slds-col slds-size_1-of-1 slds-medium-size_3-of-12" style={{ display: 'flex' }}>
                <div className="foundation-tile">
                  <p className="slds-text-title_caps">Customer</p>
                  <p className="slds-text-heading_small slds-m-top_x-small">{activeTicket.customer}</p>
                </div>
              </div>
              <div className="slds-col slds-size_1-of-1 slds-medium-size_2-of-12" style={{ display: 'flex' }}>
                <div className="foundation-tile">
                  <p className="slds-text-title_caps">Counter</p>
                  <p className="slds-text-heading_small slds-m-top_x-small">{activeTicket.counter}</p>
                </div>
              </div>
              <div className="slds-col slds-size_1-of-1 slds-medium-size_2-of-12" style={{ display: 'flex' }}>
                <div className="foundation-tile">
                  <p className="slds-text-title_caps">Assigned agent</p>
                  <p className="slds-text-heading_small slds-m-top_x-small">{activeTicket.owner}</p>
                </div>
              </div>
              <div className="slds-col slds-size_1-of-1 slds-medium-size_3-of-12" style={{ display: 'flex' }}>
                <div className="foundation-tile">
                  <div className="slds-grid slds-grid_align-spread slds-grid_vertical-align-center">
                    <p className="slds-text-title_caps">Current status</p>
                    <span className={`slds-badge ${statusBadgeTone}`}>{activeTicket.priority} priority</span>
                  </div>
                  <p className="slds-text-heading_small slds-m-top_x-small">{activeTicket.status}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="slds-m-top_medium dmv-layout">
            <div>
              <Card heading="Current transaction" icon={<Icon category="standard" name="service_appointment" />}>
                <div className="slds-p-around_medium">
                  <p className="slds-text-title_caps">Active case only</p>
                  <p className="slds-text-heading_small slds-m-top_x-small">Ticket {activeTicket.id}</p>
                  <p className="slds-m-top_x-small">{activeTicket.customer}</p>
                  <p className="slds-m-top_x-small slds-text-color_weak">{activeTicket.service} at {activeTicket.counter}.</p>
                  <p className="slds-m-top_medium slds-text-color_weak">Use Current queue to switch to another pending ticket when needed.</p>
                </div>
              </Card>

              <Card heading="Live activity" icon={<Icon category="standard" name="task" />} className="slds-m-top_medium">
                <div className="slds-p-around_medium">
                  <ul className="slds-has-divider_bottom-space">
                    {activityLog.map((entry, index) => (
                      <li key={`${entry}-${index}`} className="slds-p-vertical_x-small slds-text-body_small">{entry}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>

            <div>
              <Card heading="Case review essentials" icon={<Icon category="standard" name="metrics" />}>
                <div className="slds-p-around_medium">
                  <div className="slds-grid slds-gutters_x-small slds-wrap" style={{ alignItems: 'stretch' }}>
                    <div className="slds-col slds-size_1-of-1 slds-medium-size_4-of-12" style={{ display: 'flex' }}>
                      <div className="foundation-tile">
                        <p className="slds-text-title_caps">Applicant</p>
                        <p className="slds-text-heading_small slds-m-top_x-small">{activeTicket.customer}</p>
                        <p className="slds-text-body_small slds-text-color_weak">Service: {activeTicket.service}</p>
                        <p className="slds-text-body_small slds-text-color_weak">Counter: {activeTicket.counter}</p>
                      </div>
                    </div>
                    <div className="slds-col slds-size_1-of-1 slds-medium-size_4-of-12" style={{ display: 'flex' }}>
                      <div className="foundation-tile">
                        <p className="slds-text-title_caps">Document status</p>
                        <p className="slds-text-heading_small slds-m-top_x-small">{activeTicket.docsVerified}/{activeTicket.docsRequired} verified</p>
                        <p className="slds-text-body_small slds-text-color_weak">{allDocumentsReady ? 'All required documents received' : `${missingDocuments.length} required document(s) missing`}</p>
                      </div>
                    </div>
                    <div className="slds-col slds-size_1-of-1 slds-medium-size_4-of-12" style={{ display: 'flex' }}>
                      <div className="foundation-tile">
                        <p className="slds-text-title_caps">Decision state</p>
                        <p className="slds-text-heading_small slds-m-top_x-small">{workflowBadge.label}</p>
                        <p className="slds-text-body_small slds-text-color_weak">Status: {activeTicket.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="slds-m-top_medium dmv-workflow-grid">
                <div>
                  <Card heading={`Process case · ${activeTicket.id}`} icon={<Icon category="standard" name="record_update" />}>
                    <div className="slds-p-around_medium">
                      <div className="foundation-tile">
                        <p className="slds-text-title_caps">Current case objective</p>
                        <p className="slds-text-heading_small slds-m-top_x-small">{activeTicket.nextAction}</p>
                        <p className="slds-m-top_x-small">{activeTicket.customer} is processing {activeTicket.service.toLowerCase()} at {activeTicket.counter}.</p>
                      </div>

                      <div className="foundation-tile slds-m-top_medium">
                        <div className="slds-grid slds-grid_align-spread slds-grid_vertical-align-center dmv-step-header">
                          <p className="slds-text-title_caps">Step by step</p>
                          <span className="slds-badge">
                            {workflowBadge.label}
                          </span>
                        </div>
                        <ol className="workflow-steps-list">
                          {workflowStepStates.map((step) => (
                            <li
                              key={step.label}
                              className={
                                step.status === 'done'
                                  ? 'workflow-step-done'
                                  : step.status === 'blocked'
                                    ? 'workflow-step-blocked'
                                    : step.status === 'current'
                                      ? 'workflow-step-current'
                                      : ''
                              }
                            >
                              <div className="workflow-step-item">
                                <span className="workflow-step-label">{step.label}</span>
                                <span
                                  className={`slds-badge workflow-step-indicator ${step.status === 'done' ? 'slds-theme_success' : step.status === 'blocked' ? 'slds-theme_warning' : step.status === 'current' ? 'slds-theme_info' : ''}`}
                                >
                                  {step.statusLabel}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ol>
                        {!allDocumentsReady ? <p className="workflow-missing-note slds-text-color_error"><strong>Missing documents:</strong> {missingDocuments.join(', ')}</p> : null}
                      </div>

                      <div className="foundation-tile slds-m-top_medium">
                        <p className="slds-text-title_caps">Mandatory confirmations</p>
                        <div className="slds-m-top_x-small">
                          <Checkbox labels={{ label: 'Identity details matched with record' }} checked={identityConfirmed} onChange={(_event: unknown, data: { checked: boolean }) => setIdentityConfirmed(data.checked)} />
                        </div>
                        <div className="slds-m-top_x-small">
                          <Checkbox labels={{ label: 'Address verification completed' }} checked={addressConfirmed} onChange={(_event: unknown, data: { checked: boolean }) => setAddressConfirmed(data.checked)} />
                        </div>
                        <div className="slds-m-top_x-small">
                          <Checkbox labels={{ label: `${nextRequiredDocument ?? 'Final document'} reviewed and accepted` }} checked={photoConfirmed} onChange={(_event: unknown, data: { checked: boolean }) => setPhotoConfirmed(data.checked)} />
                        </div>
                        <p className="slds-m-top_medium slds-text-color_weak">
                          {allCoreChecksConfirmed ? (allDocumentsReady ? 'All confirmations complete.' : `Confirmations complete. Required document still pending: ${nextRequiredDocument}.`) : 'Complete all confirmations before compliance and issuance.'}
                        </p>
                      </div>

                      <div className="slds-m-top_medium">
                        {processProgress.map((step) => (
                          <div key={step.name} className="slds-m-bottom_medium">
                            <div className="slds-grid slds-grid_align-spread">
                              <span className="slds-text-body_small slds-text-color_weak">{step.name}</span>
                              <span className="slds-text-body_small">{step.value}%</span>
                            </div>
                            <ProgressBar value={step.value} className="slds-m-top_x-small" />
                          </div>
                        ))}
                      </div>

                      <div className="slds-m-top_medium">
                        <p className="slds-text-title_caps">Primary actions</p>
                        <p className="slds-text-body_small slds-text-color_weak slds-m-top_x-small">
                          Use these for the normal happy path. Exceptions are handled in the panel on the right.
                        </p>
                        <div className="slds-grid slds-grid_align-spread slds-grid_vertical-align-center slds-wrap slds-m-top_medium dmv-primary-actions" style={{ gap: '0.5rem' }}>
                          <div className="dmv-primary-action-slot">
                            {canVerifyDocuments ? <Button label={nextRequiredDocument ? `Verify ${nextRequiredDocument}` : 'Verify next required document'} variant="neutral" onClick={handleVerifyDocuments} /> : null}
                          </div>
                          <div className="dmv-primary-action-slot">
                            {canIssueTicket ? (
                              <Button label="Issue and close ticket" variant="brand" onClick={handleCloseTicket} />
                            ) : canRunCompliance ? (
                              <Button label="Everything checks out" variant="brand" onClick={handleEverythingChecksOut} />
                            ) : (
                              <Button label="Everything checks out" variant="neutral" disabled onClick={handleEverythingChecksOut} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div>
                  <Card heading="Case history and verification" icon={<Icon category="standard" name="user" />}>
                    <div className="slds-p-around_medium">
                      <div className="slds-grid slds-grid_align-spread slds-grid_vertical-align-center slds-wrap" style={{ gap: '0.5rem' }}>
                        <p className="slds-text-heading_small">Ticket {activeTicket.id}</p>
                        <span className={`slds-badge ${workflowBadge.tone}`}>{activeTicket.status}</span>
                      </div>
                      <p className="slds-m-top_x-small slds-text-body_small slds-text-color_weak">
                        {activeTicket.service} · {activeTicket.visitType}
                      </p>

                      <div className="case-meta-list slds-m-top_medium" role="list" aria-label="Current ticket details">
                        <div className="case-meta-row" role="listitem">
                          <p className="case-meta-label">Customer</p>
                          <p className="case-meta-value">{activeTicket.customer}</p>
                        </div>
                        <div className="case-meta-row" role="listitem">
                          <p className="case-meta-label">Previous visit</p>
                          <p className="case-meta-value">{activeTicket.lastVisit}</p>
                        </div>
                        <div className="case-meta-row" role="listitem">
                          <p className="case-meta-label">Counter</p>
                          <p className="case-meta-value">{activeTicket.counter}</p>
                        </div>
                        <div className="case-meta-row" role="listitem">
                          <p className="case-meta-label">Owner</p>
                          <p className="case-meta-value">{activeTicket.owner}</p>
                        </div>
                        <div className="case-meta-row" role="listitem">
                          <p className="case-meta-label">Due now</p>
                          <p className="case-meta-value">{activeTicket.due}</p>
                        </div>
                        <div className="case-meta-row" role="listitem">
                          <p className="case-meta-label">Priority</p>
                          <p className="case-meta-value">{activeTicket.priority}</p>
                        </div>
                      </div>

                      {activeTicket.exceptionState ? <p className="slds-m-top_small slds-text-color_error"><strong>Exception state:</strong> {activeTicket.exceptionState}</p> : null}

                      <div className="case-section">
                        <div className="slds-grid slds-grid_align-spread slds-grid_vertical-align-center slds-wrap" style={{ gap: '0.5rem' }}>
                          <p className="slds-text-title_caps">Previously submitted</p>
                          <span className={`slds-badge ${statusBadgeTone}`}>{activeTicket.priority} priority</span>
                        </div>
                        {activeTicket.priorSubmissions.length > 0 ? (
                          activeTicket.priorSubmissions.map((submission) => (
                            <p key={submission} className="slds-m-top_x-small slds-text-body_small">{submission}</p>
                          ))
                        ) : (
                          <p className="slds-m-top_x-small slds-text-body_small slds-text-color_weak">No prior document submissions on file.</p>
                        )}
                      </div>

                      <div className="case-section">
                        <p className="slds-text-title_caps">Documents to verify now</p>
                        <div className="case-doc-list">
                          {requiredDocuments.map((doc, index) => (
                            <div key={doc}>
                              <Checkbox labels={{ label: doc }} checked={index < activeTicket.docsVerified} />
                            </div>
                          ))}
                        </div>
                        {!allDocumentsReady ? <p className="slds-m-top_medium slds-text-color_error"><strong>Missing:</strong> {missingDocuments.join(', ')}</p> : null}
                        <p className="slds-m-top_medium slds-text-color_weak">Last updated {activeTicket.lastUpdated}</p>
                      </div>
                    </div>
                  </Card>

                  <Card heading="Exceptions and flagging" icon={<Icon category="standard" name="choice" />} className="slds-m-top_medium">
                    <div className="slds-p-around_medium">
                      <p className="slds-text-body_small slds-text-color_weak">Use this only when the case cannot follow the normal path.</p>
                      <RadioGroup
                        label="Decision"
                        name="decision"
                        value={caseDecision}
                        onChange={(_event: unknown, data: { value: string }) => setCaseDecision(data.value)}
                      >
                        <Radio labels={{ label: 'Reschedule for missing documents' }} value="reschedule" />
                        <Radio labels={{ label: 'Send to supervisor review' }} value="escalate" />
                        <Radio labels={{ label: 'Hold / no interaction possible (flag)' }} value="hold" />
                      </RadioGroup>
                      <p className="slds-text-body_small slds-text-color_weak slds-m-top_x-small">
                        Supervisor review is for policy exceptions, identity mismatch, legal discrepancies, or cases the counter agent cannot resolve alone.
                      </p>
                      <Textarea
                        label="Decision note"
                        value={caseDecisionNote}
                        onChange={(_event: unknown, data: { value: string }) => setCaseDecisionNote(data.value)}
                        placeholder="Reason, missing context, or follow-up instruction"
                      />
                      <Button label="Confirm exception" variant="neutral" className="slds-m-top_medium" onClick={handleConfirmDecision} />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isQueueModalOpen}
          ariaHideApp={false}
          heading="Current queue"
          containerClassName="queue-modal__container"
          contentClassName="queue-modal__content"
          contentStyle={{ padding: 0 }}
          footer={
            <div className="slds-grid slds-grid_align-spread slds-grid_vertical-align-center slds-wrap" role="group">
              <div className="slds-button-group" role="group" aria-label="Queue pagination">
                <Button label="Previous" variant="neutral" disabled={queuePage === 1} onClick={() => setQueuePage((page) => Math.max(1, page - 1))} />
                <Button label="Next" variant="neutral" disabled={queuePage === queuePageCount} onClick={() => setQueuePage((page) => Math.min(queuePageCount, page + 1))} />
              </div>
              <p className="slds-text-body_small slds-text-color_weak">
                Page {queuePage} of {queuePageCount} · Showing {pagedPendingTickets.length} of {pendingTickets.length} pending tickets
              </p>
              <Button label="Close" variant="neutral" onClick={() => setIsQueueModalOpen(false)} />
            </div>
          }
          onRequestClose={() => setIsQueueModalOpen(false)}
        >
          <div className="slds-p-around_medium">
            <p className="slds-text-body_small slds-text-color_weak slds-m-bottom_medium">Select the pending ticket you want to work on now.</p>
            <div className="queue-modal__table-shell">
              <DataTable
                items={pagedPendingTickets}
                id="current-queue-table"
                keyField="id"
                fixedHeader
              >
                <DataTableColumn key="id" label="Ticket" property="id" />
                <DataTableColumn key="customer" label="Customer" property="customer" />
                <DataTableColumn key="service" label="Service" property="service" />
                <DataTableColumn key="counter" label="Counter" property="counter" />
                <DataTableColumn key="status" label="Status" property="status" />
                <DataTableColumn key="due" label="Due" property="due" />
                <DataTableColumn key="action" label="Action" property="action">
                  <QueueActionCell />
                </DataTableColumn>
              </DataTable>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isRescheduleModalOpen}
          ariaHideApp={false}
          heading={`Reschedule case · ${activeTicket.id}`}
          footer={
            <div className="slds-button-group" role="group">
              <Button label="Cancel" variant="neutral" onClick={() => setIsRescheduleModalOpen(false)} />
              <Button label="Confirm reschedule" variant="brand" onClick={handleRescheduleCase} />
            </div>
          }
          onRequestClose={() => setIsRescheduleModalOpen(false)}
        >
          <div className="slds-form_stacked">
            <p className="slds-m-bottom_medium">This case cannot be completed until missing mandatory documents are provided.</p>
            <Input
              label="Return appointment"
              value={rescheduleDate}
              onChange={(_event: unknown, data: { value: string }) => setRescheduleDate(data.value)}
              placeholder="Example: 2026-08-08 10:30 AM"
            />
            <Textarea
              label="Instructions for customer"
              value={rescheduleNote}
              onChange={(_event: unknown, data: { value: string }) => setRescheduleNote(data.value)}
            />
            <p className="slds-m-top_medium"><strong>Missing documents:</strong> {missingDocuments.join(', ') || 'None'}</p>
          </div>
        </Modal>

        <Modal
          isOpen={isModalOpen}
          ariaHideApp={false}
          heading={`Supervisor review · ${activeTicket.id}`}
          contentClassName="supervisor-modal__content"
          footer={
            <div className="supervisor-modal__footer-wrap">
              <div className="slds-button-group" role="group">
                <Button label="Cancel" variant="neutral" onClick={() => setIsModalOpen(false)} />
                <Button label="Submit review" variant="brand" onClick={handleSubmitReview} />
              </div>
            </div>
          }
          onRequestClose={() => setIsModalOpen(false)}
        >
          <div className="slds-grid slds-gutters_medium slds-wrap" key={activeTicket.id}>
            <div className="slds-col slds-size_1-of-1">
              <div className="slds-form_stacked">
                <Input label="Customer" defaultValue={activeTicket.customer} />
                <Textarea label="Supervisor note" defaultValue={`Reviewing ${activeTicket.id} (${activeTicket.service}) currently marked ${activeTicket.status}.`} />
                <RadioGroup label="Priority" name="priority" value={selectedPriority} onChange={(_event: unknown, data: { value: string }) => setSelectedPriority(data.value)}>
                  <Radio labels={{ label: 'High' }} value="High" />
                  <Radio labels={{ label: 'Medium' }} value="Medium" />
                  <Radio labels={{ label: 'Low' }} value="Low" />
                </RadioGroup>
                <div className="supervisor-notify-checkbox">
                  <Checkbox labels={{ label: 'Notify customer via SMS when ticket status changes' }} />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </IconSettings>
  );
}
