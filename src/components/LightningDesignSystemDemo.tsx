'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  DataTable,
  DataTableColumn,
} from '@salesforce/design-system-react';

const SLDS_STYLESHEET_HREF = '/slds/salesforce-lightning-design-system.min.css';
const SLDS_STYLESHEET_ID = 'slds-demo-stylesheet';
const STEP_TITLES = ['Identity & eligibility', 'Documents', 'Screening & review', 'Payment & license'];
const STEP_ACTIONS = ['Confirm identity and eligibility', 'Review required documents', 'Record screening results', 'Record payment and issue license'];
const COUNTER_NUMBER = '4';
const COUNTER = `Counter ${COUNTER_NUMBER}`;
const CLERK = 'J. Alvarez';

type FlowId = 'renewal' | 'new-license';
type DocumentStatus = 'needed' | 'verified';
type QueueStatus = 'waiting' | 'in-progress' | 'completed';

type FlowDefinition = {
  id: FlowId;
  name: string;
  service: string;
  licenseLabel: string;
  documents: string[];
  checks: string[];
  fee: string;
};

type Ticket = {
  id: string;
  customer: string;
  flowId: FlowId;
  arrival: string;
  wait: string;
  licenseDetail: string;
};

type FlowState = {
  step: number;
  identityChecks: boolean[];
  documents: { status: DocumentStatus; fileName?: string; file?: File }[];
  examChecks: boolean[];
  paymentMethod: 'card' | 'cash' | '';
  paymentRecorded: boolean;
  issued: boolean;
};

type PreviewFile = {
  documentName: string;
  file: File;
  url: string;
};

const FLOWS: Record<FlowId, FlowDefinition> = {
  renewal: {
    id: 'renewal',
    name: 'Expired license renewal',
    service: 'Driver license renewal',
    licenseLabel: 'License status',
    documents: ['Current or expired driver license', 'Proof of residence', 'Signed renewal application'],
    checks: ['Vision screening passed', 'Identity and renewal eligibility confirmed'],
    fee: '$42.00',
  },
  'new-license': {
    id: 'new-license',
    name: 'First-time license application',
    service: 'First-time driver license',
    licenseLabel: 'Application type',
    documents: ['Proof of identity and date of birth', 'Proof of residence', 'Social Security number or exemption'],
    checks: ['Vision screening passed', 'Knowledge test passed', 'Identity and age eligibility confirmed'],
    fee: '$58.00',
  },
};

const TICKETS: Ticket[] = [
  { id: 'A-1042', customer: 'Mina Patel', flowId: 'renewal', arrival: '9:02 AM', wait: '8 min', licenseDetail: 'Expired · eligible to renew' },
  { id: 'A-1045', customer: 'Carlos Rivera', flowId: 'new-license', arrival: '9:05 AM', wait: '5 min', licenseDetail: 'First-time applicant · Class C' },
  { id: 'A-1047', customer: 'Priya Shah', flowId: 'renewal', arrival: '9:08 AM', wait: '2 min', licenseDetail: 'Expired · eligible to renew' },
  { id: 'A-1051', customer: 'Jordan Lee', flowId: 'new-license', arrival: '9:10 AM', wait: 'Just arrived', licenseDetail: 'First-time applicant · Class C' },
  { id: 'A-1053', customer: 'Elena Garcia', flowId: 'new-license', arrival: '9:12 AM', wait: 'Just arrived', licenseDetail: 'First-time applicant · Class C' },
];

function createInitialFlowState(flowId: FlowId): FlowState {
  const definition = FLOWS[flowId];

  return {
    step: 1,
    identityChecks: [false, false],
    documents: definition.documents.map(() => ({ status: 'needed' })),
    examChecks: definition.checks.map(() => false),
    paymentMethod: '',
    paymentRecorded: false,
    issued: false,
  };
}

export function LightningDesignSystemDemo() {
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [ticketStatuses, setTicketStatuses] = useState<Record<string, QueueStatus>>({});
  const [flowStates, setFlowStates] = useState<Record<string, FlowState>>({});
  const [announcement, setAnnouncement] = useState('');
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
  const previewDialogRef = useRef<HTMLDialogElement>(null);
  const previewUrlRef = useRef<string | null>(null);

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

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  useEffect(() => {
    const dialog = previewDialogRef.current;
    if (!dialog) return;

    if (previewFile && !dialog.open) dialog.showModal();
    if (!previewFile && dialog.open) dialog.close();
  }, [previewFile]);

  const activeTicket = TICKETS.find((ticket) => ticket.id === activeTicketId) ?? null;
  const flow = activeTicket ? FLOWS[activeTicket.flowId] : null;
  const state = activeTicket
    ? flowStates[activeTicket.id] ?? createInitialFlowState(activeTicket.flowId)
    : null;
  const ticketStatus = (ticketId: string): QueueStatus => ticketStatuses[ticketId] ?? 'waiting';
  const queueItems = TICKETS.map((ticket) => {
    const status = ticketStatus(ticket.id);
    const statusLabel = status === 'in-progress' ? 'In progress' : status === 'completed' ? 'Completed' : 'Waiting';
    return {
      ...ticket,
      serviceName: FLOWS[ticket.flowId].service,
      statusLabel,
      action: status === 'completed'
        ? (
          <Button
            label="View"
            aria-label={`View completed service for ${ticket.customer}, ticket ${ticket.id}`}
            variant="neutral"
            className="dmv-ticket-action-button"
            onClick={() => viewCompletedTicket(ticket)}
          />
        )
        : (
          <Button
            label={status === 'in-progress' ? 'Resume' : 'Call'}
            aria-label={`${status === 'in-progress' ? 'Resume' : 'Call'} ${ticket.customer}, ticket ${ticket.id}, ${status === 'in-progress' ? 'at' : 'to'} ${COUNTER}`}
            variant={status === 'in-progress' ? 'neutral' : 'brand'}
            className="dmv-ticket-action-button"
            onClick={() => callTicket(ticket)}
          />
        ),
    };
  });
  const waitingCount = TICKETS.filter((ticket) => ticketStatus(ticket.id) === 'waiting').length;

  const updateFlowState = (patch: Partial<FlowState>) => {
    if (!activeTicket || !state) return;
    setFlowStates((previous) => ({
      ...previous,
      [activeTicket.id]: { ...state, ...patch },
    }));
  };

  const callTicket = (ticket: Ticket) => {
    setFlowStates((previous) => ({
      ...previous,
      [ticket.id]: previous[ticket.id] ?? createInitialFlowState(ticket.flowId),
    }));
    setTicketStatuses((previous) => ({ ...previous, [ticket.id]: 'in-progress' }));
    setActiveTicketId(ticket.id);
    setAnnouncement(`${ticket.customer}, ticket ${ticket.id}, called to ${COUNTER}. ${FLOWS[ticket.flowId].name} workflow opened.`);
  };

  const viewCompletedTicket = (ticket: Ticket) => {
    setActiveTicketId(ticket.id);
    setAnnouncement(`Viewing completed service for ${ticket.customer}, ticket ${ticket.id}.`);
  };

  const previewUploadedFile = (documentName: string, file: File) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setPreviewFile({ documentName, file, url });
  };

  const closeFilePreview = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setPreviewFile(null);
  };

  const updateCheck = (key: 'identityChecks' | 'examChecks', index: number, checked: boolean) => {
    if (!state) return;
    const values = [...state[key]];
    values[index] = checked;
    updateFlowState({ [key]: values });
  };

  const uploadAndVerifyDocument = (index: number, file: File) => {
    if (!state || !flow) return;
    const documents = state.documents.map((document, documentIndex) => (
      documentIndex === index
        ? { status: 'verified' as const, fileName: file.name, file }
        : document
    ));
    const allVerified = documents.every((document) => document.status === 'verified');
    updateFlowState({ documents, ...(allVerified ? { step: 3 } : {}) });
    setAnnouncement(allVerified
      ? 'All required documents uploaded and verified. Moving to screening.'
      : `${flow.documents[index]} uploaded and verified.`);
  };

  const verifiedDocuments = state?.documents.filter((document) => document.status === 'verified').length ?? 0;
  const allDocumentsVerified = Boolean(state && state.documents.every((document) => document.status === 'verified'));
  const identityComplete = Boolean(state && state.identityChecks.every(Boolean));
  const screeningComplete = Boolean(state && state.examChecks.every(Boolean));
  const steps = STEP_TITLES.map((title, index) => ({
    title,
    number: index + 1,
    status: state?.issued || (state && index + 1 < state.step)
      ? 'complete'
      : state && index + 1 === state.step
        ? 'current'
        : 'upcoming',
  }));
  const progressValue = state ? state.issued ? 100 : Math.round(((state.step - 1) / STEP_TITLES.length) * 100) : 0;
  const currentStatus = !state
    ? 'Waiting'
    : state.issued
      ? 'License issued'
      : state.step === 1
        ? 'Identity review'
        : state.step === 2
          ? allDocumentsVerified ? 'Documents verified' : 'Documents needed'
          : state.step === 3
            ? 'Screening in progress'
            : state.paymentRecorded ? 'Ready to issue' : 'Payment due';

  const continueToStep = (nextStep: number) => {
    updateFlowState({ step: nextStep });
    setAnnouncement(`Step ${nextStep} of ${STEP_TITLES.length}: ${STEP_TITLES[nextStep - 1]}.`);
  };

  const recordPayment = () => {
    updateFlowState({ paymentRecorded: true });
    setAnnouncement(`Payment recorded by ${state?.paymentMethod === 'card' ? 'card' : 'cash'}. Ready to issue the license.`);
  };

  const issueLicense = () => {
    if (!activeTicket) return;
    updateFlowState({ issued: true });
    setTicketStatuses((previous) => ({ ...previous, [activeTicket.id]: 'completed' }));
    setAnnouncement(`Ticket ${activeTicket.id} complete. License issued.`);
  };

  const returnToQueue = () => {
    setActiveTicketId(null);
    setAnnouncement(`Returned to the ${COUNTER.toLowerCase()} ticket queue.`);
  };

  return (
    <div className="dmv-demo-root slds-theme_default">
      <a href="#dmv-main-content" className="dmv-skip-link">Skip to main content</a>
      <header className="dmv-app-header">
        <div className="dmv-utility-bar">
          <Link
            href="/work/design-system-migration/demo"
            className="dmv-brand"
            aria-label="Service queue home"
            onClick={returnToQueue}
          >
            <span className="dmv-brand-mark" aria-hidden="true">D</span>
            <span>State Services</span>
          </Link>
          <div className="dmv-utility-context">
            <span>Driver Licensing</span>
            <span className="dmv-context-divider" aria-hidden="true">/</span>
              <span>Staff workspace</span>
          </div>
          <Link href="/work/design-system-migration" className="dmv-back-link">Back to case study</Link>
        </div>
        <nav className="dmv-app-nav" aria-label="Workspace navigation">
          <span className="dmv-nav-current" aria-current="page">Service desk</span>
          <span className="dmv-clerk-name"><span className="dmv-avatar" aria-hidden="true">JA</span> {CLERK}</span>
        </nav>
      </header>

      <div id="dmv-main-content" className="dmv-demo-shell" tabIndex={-1}>
        <nav aria-label="Breadcrumbs" className="dmv-breadcrumbs">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span>Driver licensing</span><span aria-hidden="true">/</span>
          <span aria-current="page">{activeTicket ? 'Customer service' : 'Ticket queue'}</span>
        </nav>

        <div className="dmv-page-heading">
          <div>
            <h1>{activeTicket ? ticketStatus(activeTicket.id) === 'completed' ? 'Completed service' : 'License service workflow' : 'Service queue'}</h1>
            <p className="dmv-page-description">
              {activeTicket
                ? ticketStatus(activeTicket.id) === 'completed'
                  ? 'Review this completed service record.'
                  : 'Use the steps below to complete this service.'
                : 'Call a waiting customer or resume an in-progress case.'}
            </p>
          </div>
          <div className="dmv-page-heading-actions">
            <div className="dmv-page-counter" aria-label={`Service counter ${COUNTER_NUMBER}`}>
              <span>Service counter</span>
              <strong>{COUNTER_NUMBER}</strong>
            </div>
            {activeTicket && (
              <Button label="Back to ticket queue" variant="neutral" onClick={returnToQueue} />
            )}
          </div>
        </div>

        {!activeTicket ? (
          <>
            <Card
              heading="Customer tickets"
              className="dmv-card dmv-queue-card"
              headerActions={(
                <span className="dmv-queue-count" aria-live="polite">
                  {waitingCount === 1 ? '1 customer waiting' : `${waitingCount} customers waiting`}
                </span>
              )}
            >
              <div className="dmv-table-scroll" role="region" aria-label="Ticket queue table" tabIndex={0}>
                <DataTable
                  id="dmv-ticket-queue"
                  className="dmv-ticket-table"
                  items={queueItems}
                  fixedLayout
                  stackedHorizontal
                >
                  <DataTableColumn key="ticket" label="Ticket" property="id" primaryColumn />
                  <DataTableColumn key="customer" label="Customer" property="customer" />
                  <DataTableColumn key="service" label="Service requested" property="serviceName" />
                  <DataTableColumn key="arrival" label="Checked in" property="arrival" />
                  <DataTableColumn key="wait" label="Wait" property="wait" />
                  <DataTableColumn key="status" label="Status" property="statusLabel" />
                  <DataTableColumn key="action" label="Action" property="action" />
                </DataTable>
              </div>
            </Card>
          </>
        ) : (
          <>
            <section
              className="dmv-case-banner"
              aria-label={ticketStatus(activeTicket.id) === 'completed' ? 'Completed service record' : 'Customer currently being served'}
            >
              <div className="dmv-now-serving">
                <span className="dmv-serving-label">{ticketStatus(activeTicket.id) === 'completed' ? 'COMPLETED' : 'NOW SERVING'}</span>
                <strong>{activeTicket.id}</strong>
                <span className="dmv-serving-divider" aria-hidden="true" />
                <span className="dmv-customer-name">{activeTicket.customer}</span>
              </div>
              <div className="dmv-case-meta">
                <span>{flow?.service}</span>
                <span>{flow?.licenseLabel}: {activeTicket.licenseDetail}</span>
                <span>Checked in {activeTicket.arrival}</span>
                <span className={`dmv-status${state?.issued ? ' is-success' : state?.step === 2 && !allDocumentsVerified ? ' is-warning' : ''}`}>
                  <span className="dmv-status-dot" aria-hidden="true" />{currentStatus}
                </span>
              </div>
            </section>

            <section className="dmv-progress-card" aria-labelledby="progress-heading">
              <div className="dmv-progress-topline">
                <div>
                  <h2 id="progress-heading">Service progress</h2>
                  <p>{state?.issued ? 'All steps complete' : `Step ${state?.step} of ${STEP_TITLES.length} · ${STEP_TITLES[(state?.step ?? 1) - 1]}`}</p>
                </div>
              </div>
              <div
                className="dmv-progress-track"
                role="progressbar"
                aria-label="License service progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressValue}
                aria-valuetext={state?.issued ? 'Service complete' : `Step ${state?.step} of ${STEP_TITLES.length}`}
              >
                <span style={{ width: `${progressValue}%` }} />
              </div>
              <ol className="dmv-step-list" aria-label="Service steps">
                {steps.map((step) => (
                  <li key={step.number} className={`dmv-step is-${step.status}`} aria-current={step.status === 'current' ? 'step' : undefined}>
                    <span className="dmv-step-number" aria-hidden="true">{step.status === 'complete' ? '✓' : step.number}</span>
                    <span className="dmv-step-text">
                      <strong>{step.title}</strong>
                      <span>{step.status === 'complete' ? 'Complete' : step.status === 'current' ? 'Current step' : 'Not started'}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <div className="dmv-workspace-grid">
              <section className="dmv-main-column" aria-label="Current service step">
                {state?.issued ? (
                  <Card heading={ticketStatus(activeTicket.id) === 'completed' ? 'Completed service record' : 'Service complete'} className="dmv-card">
                    <div className="dmv-complete-panel" role="status">
                      <span className="dmv-complete-icon" aria-hidden="true">✓</span>
                      <div>
                        <h2>License issued successfully</h2>
                        <p>{activeTicket.customer}’s {flow?.service.toLowerCase()} is complete.</p>
                        <p className="dmv-reference">Reference: {activeTicket.id} · Payment: {flow?.fee}</p>
                      </div>
                    </div>
                    {flow && state && (
                      <section className="dmv-completed-documents" aria-labelledby="completed-documents-heading">
                        <div className="dmv-completed-documents-heading">
                          <div>
                            <h3 id="completed-documents-heading">Uploaded documents</h3>
                            <p>Review the files and verification status saved with this case.</p>
                          </div>
                          <span>{state.documents.filter((document) => document.status === 'verified').length} of {flow.documents.length} verified</span>
                        </div>
                        <ul className="dmv-completed-document-list">
                          {flow.documents.map((document, index) => {
                            const documentState = state.documents[index];
                            const uploadedFile = documentState.file;
                            return (
                              <li className="dmv-completed-document" key={document}>
                                <span className="dmv-completed-document-icon" aria-hidden="true">
                                  {documentState.status === 'verified' ? '✓' : '–'}
                                </span>
                                <div className="dmv-document-copy">
                                  <strong>{document}</strong>
                                  <span>
                                    {documentState.fileName
                                      ? `${documentState.fileName} · ${documentState.status === 'verified' ? 'Verified' : 'Not verified'}`
                                      : `No file attached · ${documentState.status === 'verified' ? 'Verified' : 'Not verified'}`}
                                  </span>
                                </div>
                                {uploadedFile && (
                                  <Button
                                    label="View file"
                                    aria-label={`View uploaded ${document} file ${uploadedFile.name}`}
                                    variant="neutral"
                                    onClick={() => previewUploadedFile(document, uploadedFile)}
                                  />
                                )}
                              </li>
                            );
                          })}
                        </ul>
                        <p className="dmv-field-help">Demo files stay in memory while this page is open and are not uploaded to a server.</p>
                      </section>
                    )}
                  </Card>
                ) : (
                  <Card heading={STEP_ACTIONS[(state?.step ?? 1) - 1]} className="dmv-card">
                    <div className="dmv-step-content">
                      <p className="dmv-step-intro">
                        {state?.step === 1 && 'Match the applicant’s photo and details, then confirm they are eligible for this service.'}
                        {state?.step === 2 && 'Review each original document, then upload its scan. Uploading records it as verified; adding the final document continues to screening.'}
                        {state?.step === 3 && 'Complete each required screening and record its result. Follow office policy if a check fails.'}
                        {state?.step === 4 && 'Confirm the fee with the customer, record the payment method, then issue the license.'}
                      </p>

                      {state?.step === 1 && flow && (
                        <fieldset className="dmv-checklist">
                          <legend>Confirm both items to continue</legend>
                          {[
                            'Photo and identity details match the applicant',
                            activeTicket.flowId === 'renewal' ? 'Existing license is expired and eligible for renewal' : 'Applicant meets the minimum age requirement',
                          ].map((label, index) => (
                            <label className="dmv-check-row" key={label}>
                              <input
                                type="checkbox"
                                checked={state.identityChecks[index]}
                                onChange={(event) => updateCheck('identityChecks', index, event.target.checked)}
                              />
                              <span>{label}</span>
                            </label>
                          ))}
                        </fieldset>
                      )}

                      {state?.step === 2 && flow && (
                        <>
                          <fieldset className="dmv-checklist">
                            <legend>Required documents <span>{verifiedDocuments} of {flow.documents.length} verified</span></legend>
                            {flow.documents.map((document, index) => {
                              const documentState = state.documents[index];
                              return (
                                <div className={`dmv-document-row is-${documentState.status}`} key={document}>
                                  <span className={`dmv-document-icon is-${documentState.status}`} aria-hidden="true">
                                    {documentState.status === 'verified' ? '✓' : '↑'}
                                  </span>
                                  <div className="dmv-document-copy">
                                    <strong>{document}</strong>
                                    <span>
                                      {documentState.status === 'verified'
                                        ? `Uploaded and verified${documentState.fileName ? ` · ${documentState.fileName}` : ''}`
                                        : 'Not uploaded'}
                                    </span>
                                  </div>
                                  <div className="dmv-document-action">
                                    {documentState.status === 'needed' && (
                                      <label className="dmv-upload-button">
                                        Upload scan
                                        <input
                                          type="file"
                                          aria-label={`Upload ${document}`}
                                          accept=".pdf,.jpg,.jpeg,.png"
                                          onChange={(event) => {
                                            const file = event.target.files?.[0];
                                            if (file) {
                                              uploadAndVerifyDocument(index, file);
                                            }
                                          }}
                                        />
                                      </label>
                                    )}
                                    {documentState.status === 'verified' && <span className="dmv-doc-status is-verified">Verified</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </fieldset>
                          <p className="dmv-field-help">Demo upload only. Selected file names stay in this browser and are not submitted to a server.</p>
                        </>
                      )}

                      {state?.step === 3 && flow && (
                        <fieldset className="dmv-checklist">
                          <legend>Record screening results</legend>
                          {flow.checks.map((check, index) => (
                            <label className="dmv-check-row" key={check}>
                              <input
                                type="checkbox"
                                checked={state.examChecks[index]}
                                onChange={(event) => updateCheck('examChecks', index, event.target.checked)}
                              />
                              <span>{check}</span>
                            </label>
                          ))}
                          <p className="dmv-field-help">Follow local policy for any failed or inconclusive result. Do not continue until required checks are complete.</p>
                        </fieldset>
                      )}

                      {state?.step === 4 && flow && (
                        <div className="dmv-payment-content">
                          <div className="dmv-fee-summary">
                            <span>License service fee</span>
                            <strong>{flow.fee}</strong>
                          </div>
                          {!state.paymentRecorded ? (
                            <fieldset className="dmv-checklist dmv-payment-options">
                              <legend>Choose payment method</legend>
                              {(['card', 'cash'] as const).map((method) => (
                                <label className="dmv-check-row" key={method}>
                                  <input
                                    type="radio"
                                    name={`payment-${activeTicket.id}`}
                                    value={method}
                                    checked={state.paymentMethod === method}
                                    onChange={() => updateFlowState({ paymentMethod: method })}
                                  />
                                  <span>{method === 'card' ? 'Card' : 'Cash'}</span>
                                </label>
                              ))}
                              <p className="dmv-field-help">Demo only: this records a payment choice and does not process a real payment.</p>
                            </fieldset>
                          ) : (
                            <div className="dmv-inline-guidance is-success" role="status">
                              <span className="dmv-guidance-icon" aria-hidden="true">✓</span>
                              <p>Payment recorded by {state.paymentMethod === 'card' ? 'card' : 'cash'}. You can now issue the license.</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="dmv-card-actions">
                        {state && state.step > 1 && <Button label="Back" variant="neutral" onClick={() => continueToStep(state.step - 1)} />}
                        {state?.step === 1 && (
                          <Button label="Continue to documents" variant="brand" disabled={!identityComplete} onClick={() => continueToStep(2)} />
                        )}
                        {state?.step === 2 && (
                          <Button label="Continue to screening" variant="brand" disabled={!allDocumentsVerified} onClick={() => continueToStep(3)} />
                        )}
                        {state?.step === 3 && (
                          <Button label="Continue to payment" variant="brand" disabled={!screeningComplete} onClick={() => continueToStep(4)} />
                        )}
                        {state?.step === 4 && !state.paymentRecorded && (
                          <Button label="Record payment" variant="brand" disabled={!state.paymentMethod} onClick={recordPayment} />
                        )}
                        {state?.step === 4 && state.paymentRecorded && (
                          <Button label="Issue license" variant="brand" onClick={issueLicense} />
                        )}
                      </div>
                    </div>
                  </Card>
                )}

              </section>
            </div>
          </>
        )}
        <p className="dmv-announcement" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
      </div>
      <dialog
        ref={previewDialogRef}
        className="dmv-file-preview-dialog"
        aria-labelledby="dmv-file-preview-heading"
        onCancel={(event) => {
          event.preventDefault();
          closeFilePreview();
        }}
      >
        {previewFile && (
          <>
            <div className="dmv-file-preview-header">
              <div>
                <h2 id="dmv-file-preview-heading">{previewFile.documentName}</h2>
                <p>{previewFile.file.name}</p>
              </div>
              <div className="dmv-file-preview-actions">
                <a className="slds-button slds-button_neutral" href={previewFile.url} download={previewFile.file.name}>Download</a>
                <Button label="Close preview" variant="neutral" onClick={closeFilePreview} />
              </div>
            </div>
            <div className="dmv-file-preview-content">
              {previewFile.file.type === 'application/pdf' || /\.pdf$/i.test(previewFile.file.name)
                ? <iframe src={previewFile.url} title={`Preview of ${previewFile.documentName}`} />
                : previewFile.file.type.startsWith('image/') || /\.(jpe?g|png)$/i.test(previewFile.file.name)
                  ? <iframe src={previewFile.url} title={`Preview of ${previewFile.documentName}`} />
                  : <p>Preview is not available for this file type. Download the file to review it.</p>}
            </div>
          </>
        )}
      </dialog>

      <style jsx global>{`
        .dmv-demo-root {
          --dmv-navy: #032d60;
          --dmv-brand: #0b5cab;
          --dmv-brand-dark: #014486;
          --dmv-ink: #181818;
          --dmv-muted: #444;
          --dmv-canvas: #f3f3f3;
          min-height: 100vh;
          padding-top: 96px;
          background: var(--dmv-canvas);
          color: var(--dmv-ink);
          font-family: 'Salesforce Sans', Arial, sans-serif;
          font-size: 1rem;
          line-height: 1.5;
        }

        .dmv-demo-root *,
        .dmv-demo-root *::before,
        .dmv-demo-root *::after { box-sizing: border-box; }

        .dmv-demo-root a:focus-visible,
        .dmv-demo-root button:focus-visible,
        .dmv-demo-root input:focus-visible,
        .dmv-demo-root [tabindex]:focus-visible {
          outline: 3px solid #0b5cab !important;
          outline-offset: 3px;
          box-shadow: 0 0 0 2px #fff !important;
        }

        .dmv-skip-link {
          position: fixed;
          z-index: 1000;
          top: 8px;
          left: 8px;
          transform: translateY(-160%);
          padding: 10px 14px;
          border-radius: 4px;
          background: #fff;
          color: var(--dmv-navy);
          font-weight: 700;
        }
        .dmv-skip-link:focus { transform: translateY(0); }

        .dmv-app-header {
          position: fixed;
          z-index: 100;
          inset: 0 0 auto;
          box-shadow: 0 1px 3px rgb(0 0 0 / 18%);
        }
        .dmv-utility-bar {
          min-height: 56px;
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 0 32px;
          background: #fff;
          color: var(--dmv-ink);
        }
        .dmv-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--dmv-navy);
          font-size: 1.125rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
        }
        .dmv-brand-mark {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: #0b5cab;
          color: #fff;
          font-size: 1rem;
        }
        .dmv-utility-context {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--dmv-muted);
          font-size: 0.875rem;
        }
        .dmv-context-divider { color: #747474; }
        .dmv-back-link {
          margin-left: auto;
          color: var(--dmv-brand-dark);
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
        }
        .dmv-app-nav {
          min-height: 40px;
          display: flex;
          align-items: stretch;
          gap: 28px;
          padding: 0 32px;
          background: var(--dmv-navy);
          color: #fff;
          font-size: 0.875rem;
        }
        .dmv-nav-current {
          display: flex;
          align-items: center;
          min-height: 40px;
          color: #fff;
        }
        .dmv-nav-current {
          border-bottom: 3px solid #78b9ff;
          font-weight: 700;
        }
        .dmv-clerk-name {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
        }
        .dmv-avatar {
          display: grid;
          width: 25px;
          height: 25px;
          place-items: center;
          border-radius: 50%;
          background: #d8e6fe;
          color: var(--dmv-navy);
          font-size: 0.6875rem;
          font-weight: 700;
        }

        .dmv-demo-shell {
          width: min(100%, 1440px);
          margin: 0 auto;
          padding: 18px 32px 48px;
        }
        .dmv-breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin: 0 0 18px;
          color: #444;
          font-size: 0.8125rem;
        }
        .dmv-breadcrumbs a {
          color: var(--dmv-brand-dark);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .dmv-page-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
        }
        .dmv-page-heading-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .dmv-page-counter {
          display: grid;
          grid-template-columns: auto auto;
          align-items: center;
          column-gap: 10px;
          padding: 8px 14px;
          border: 1px solid #b5c5d5;
          border-radius: 6px;
          background: #fff;
          color: var(--dmv-navy);
        }
        .dmv-page-counter > span {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .dmv-page-counter > strong {
          font-size: 1.75rem;
          font-weight: 700;
          line-height: 1;
        }
        .dmv-page-heading h1 {
          margin: 0;
          color: #181818;
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          font-weight: 700;
          line-height: 1.2;
        }
        .dmv-page-description {
          margin-top: 8px;
          color: #444;
          font-size: 1rem;
        }
        .dmv-demo-root .slds-button {
          min-height: 44px;
          font-size: 0.9375rem;
          font-weight: 600;
        }
        .dmv-demo-root .slds-button_brand {
          border-color: var(--dmv-brand);
          background: var(--dmv-brand);
        }
        .dmv-demo-root .slds-button_brand:not(:disabled):not([disabled]):hover,
        .dmv-demo-root .slds-button_brand:not(:disabled):not([disabled]):focus {
          border-color: var(--dmv-brand-dark);
          background: var(--dmv-brand-dark);
        }
        .dmv-demo-root .slds-button:disabled { color: #4e4e4e; }
        .dmv-demo-root .slds-button_brand:disabled,
        .dmv-demo-root .slds-button_brand[disabled] {
          border-color: #c9c9c9;
          background: #c9c9c9;
          color: #4e4e4e;
        }

        .dmv-progress-card,
        .dmv-case-banner {
          margin-bottom: 16px;
          border: 1px solid #d8dde6;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 1px 2px rgb(24 24 24 / 5%);
        }
        .dmv-queue-card { margin-bottom: 16px; }
        .dmv-queue-count {
          color: #444;
          font-size: 0.8125rem;
          font-weight: 700;
          white-space: nowrap;
        }
        .dmv-table-scroll {
          overflow-x: auto;
        }
        .dmv-ticket-table {
          width: 100%;
          margin: 0;
          font-size: 0.875rem;
        }
        .dmv-ticket-table thead th:nth-child(1) { width: 10%; }
        .dmv-ticket-table thead th:nth-child(2) { width: 17%; }
        .dmv-ticket-table thead th:nth-child(3) { width: 24%; }
        .dmv-ticket-table thead th:nth-child(4) { width: 12%; }
        .dmv-ticket-table thead th:nth-child(5) { width: 10%; }
        .dmv-ticket-table thead th:nth-child(6) { width: 15%; }
        .dmv-ticket-table thead th:nth-child(7) { width: 12%; }
        .dmv-ticket-table thead th .slds-th__action,
        .dmv-ticket-table tbody th,
        .dmv-ticket-table tbody td {
          padding-right: 1rem;
          padding-left: 1rem;
        }
        .dmv-ticket-table thead th:nth-child(7) .slds-th__action {
          justify-content: center;
        }
        .dmv-ticket-table tbody td[data-label="Action"] > .slds-truncate {
          display: flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
        }
        .dmv-ticket-table .dmv-ticket-action-button {
          width: 7rem;
          min-width: 7rem;
        }
        @media (max-width: 48em) {
          .dmv-ticket-table tbody td[data-label="Action"] {
            text-align: left;
          }
          .dmv-ticket-table tbody td[data-label="Action"]::before {
            float: none;
            margin-top: 0;
          }
          .dmv-ticket-table tbody td[data-label="Action"] > .slds-truncate {
            width: 100%;
          }
        }
        .dmv-ticket-action-button {
          width: 7rem;
          min-width: 7rem;
          justify-content: center;
        }
        .dmv-case-banner {
          padding: 16px 20px;
          border-left: 5px solid var(--dmv-brand);
        }
        .dmv-now-serving,
        .dmv-case-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .dmv-serving-label {
          color: #444;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }
        .dmv-now-serving > strong { color: var(--dmv-navy); font-size: 1.375rem; }
        .dmv-serving-divider { height: 22px; border-left: 1px solid #c9c9c9; }
        .dmv-customer-name { font-size: 1.125rem; font-weight: 700; }
        .dmv-case-meta {
          gap: 8px 18px;
          margin-top: 8px;
          color: #444;
          font-size: 0.875rem;
        }
        .dmv-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 4px 9px;
          border: 1px solid #aeb8c2;
          border-radius: 999px;
          background: #f3f3f3;
          color: #333;
          font-weight: 600;
        }
        .dmv-status.is-warning {
          border-color: #8a4b00;
          background: #fff4e5;
          color: #5f3900;
        }
        .dmv-status.is-success {
          border-color: #2e844a;
          background: #e8f6ec;
          color: #194e31;
        }
        .dmv-status-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }

        .dmv-progress-card { padding: 20px 22px 18px; }
        .dmv-progress-topline {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }
        .dmv-progress-topline h2 {
          margin: 0;
          color: #181818;
          font-size: 1.125rem;
          font-weight: 700;
          line-height: 1.3;
        }
        .dmv-progress-topline p { margin-top: 4px; color: #444; font-size: 0.9375rem; }
        .dmv-progress-track {
          height: 8px;
          overflow: hidden;
          margin-top: 16px;
          border-radius: 999px;
          background: #e5e5e5;
        }
        .dmv-progress-track > span {
          height: 100%;
          display: block;
          border-radius: inherit;
          background: #0b5cab;
          transition: width 180ms ease;
        }
        .dmv-step-list {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin: 18px 0 0;
          padding: 0;
          list-style: none;
        }
        .dmv-step { min-width: 0; display: flex; align-items: flex-start; gap: 9px; color: #444; }
        .dmv-step-number {
          flex: none;
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border: 1px solid #747474;
          border-radius: 50%;
          background: #fff;
          color: #333;
          font-size: 0.8125rem;
          font-weight: 700;
        }
        .dmv-step.is-current .dmv-step-number { border: 2px solid #0b5cab; color: #032d60; }
        .dmv-step.is-complete .dmv-step-number { border-color: #2e844a; background: #2e844a; color: #fff; }
        .dmv-step-text { min-width: 0; display: grid; gap: 2px; }
        .dmv-step-text strong { color: #333; font-size: 0.8125rem; line-height: 1.35; }
        .dmv-step.is-current .dmv-step-text strong { color: #032d60; }
        .dmv-step-text > span { color: #444; font-size: 0.75rem; }

        .dmv-workspace-grid {
          display: block;
        }
        .dmv-main-column { display: grid; gap: 16px; min-width: 0; }
        .dmv-demo-root .dmv-card {
          overflow: hidden;
          border: 1px solid #d8dde6;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 1px 2px rgb(24 24 24 / 5%);
        }
        .dmv-demo-root .dmv-card .slds-card__header {
          min-height: 54px;
          align-items: center;
          margin: 0;
          padding: 12px 20px;
          border-bottom: 1px solid #e5e5e5;
          background: #fff;
        }
        .dmv-demo-root .dmv-card .slds-card__header-title { color: #181818; font-size: 1rem; font-weight: 700; }
        .dmv-demo-root .dmv-card .slds-card__body { margin: 0; padding: 0; }
        .dmv-step-content { padding: 20px; }
        .dmv-step-intro {
          max-width: 760px;
          margin-bottom: 18px;
          color: #333;
          font-size: 1rem;
          line-height: 1.55;
        }
        .dmv-inline-guidance {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          margin-bottom: 18px;
          padding: 12px 14px;
          border: 1px solid #8e6b00;
          border-radius: 5px;
          background: #fff8e6;
          color: #3e2b00;
        }
        .dmv-inline-guidance.is-success { border-color: #2e844a; background: #e8f6ec; color: #194e31; }
        .dmv-guidance-icon {
          flex: none;
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border: 1px solid currentColor;
          border-radius: 50%;
          font-size: 0.8125rem;
          font-weight: 700;
          line-height: 1;
        }
        .dmv-inline-guidance p { margin: 0; font-size: 0.9375rem; line-height: 1.5; }
        .dmv-checklist { min-width: 0; margin: 0; padding: 0; border: 0; }
        .dmv-checklist legend {
          width: 100%;
          margin-bottom: 8px;
          color: #181818;
          font-size: 0.9375rem;
          font-weight: 700;
        }
        .dmv-checklist legend span { float: right; color: #444; font-size: 0.8125rem; font-weight: 400; }
        .dmv-check-row {
          min-height: 56px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px;
          border: 1px solid #d8dde6;
          border-bottom: 0;
          background: #fff;
          color: #181818;
          cursor: pointer;
        }
        .dmv-check-row:first-of-type { border-radius: 5px 5px 0 0; }
        .dmv-check-row:last-of-type { border-bottom: 1px solid #d8dde6; border-radius: 0 0 5px 5px; }
        .dmv-check-row:only-of-type { border: 1px solid #d8dde6; border-radius: 5px; }
        .dmv-check-row:hover { background: #f8fbff; }
        .dmv-check-row input { flex: none; width: 20px; height: 20px; accent-color: #0b5cab; }
        .dmv-field-help { margin-top: 10px; color: #444; font-size: 0.8125rem; line-height: 1.45; }

        .dmv-document-row {
          min-height: 76px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px;
          border: 1px solid #d8dde6;
          border-bottom: 0;
          background: #fff;
        }
        .dmv-document-row:first-of-type { border-radius: 5px 5px 0 0; }
        .dmv-document-row:last-of-type { border-bottom: 1px solid #d8dde6; border-radius: 0 0 5px 5px; }
        .dmv-document-icon {
          flex: none;
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border: 1px solid #8a4b00;
          border-radius: 50%;
          background: #fff4e5;
          color: #5f3900;
          font-size: 0.9375rem;
          font-weight: 700;
        }
        .dmv-document-icon.is-verified { border-color: #2e844a; background: #e8f6ec; color: #194e31; }
        .dmv-document-copy { flex: 1; min-width: 0; display: grid; gap: 3px; }
        .dmv-document-copy strong { color: #181818; font-size: 0.9rem; line-height: 1.35; }
        .dmv-document-copy > span { overflow-wrap: anywhere; color: #444; font-size: 0.78rem; line-height: 1.35; }
        .dmv-document-action { flex: none; display: flex; justify-content: flex-end; }
        .dmv-document-action .slds-button { padding: 0 12px; }
        .dmv-upload-button {
          position: relative;
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border: 1px solid #5c5c5c;
          border-radius: 4px;
          background: #fff;
          color: #0b5cab;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
        }
        .dmv-upload-button:hover { background: #f3f8ff; }
        .dmv-upload-button:focus-within { outline: 3px solid #0b5cab; outline-offset: 3px; }
        .dmv-upload-button input {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          clip-path: inset(50%);
          white-space: nowrap;
        }
        .dmv-doc-status {
          flex: none;
          padding: 4px 8px;
          border: 1px solid #2e844a;
          border-radius: 999px;
          background: #e8f6ec;
          color: #194e31;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .dmv-completed-documents {
          margin: 20px;
          padding-top: 18px;
          border-top: 1px solid #e5e5e5;
        }
        .dmv-completed-documents-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 12px;
        }
        .dmv-completed-documents-heading h3 {
          margin: 0;
          color: #181818;
          font-size: 1rem;
          font-weight: 700;
        }
        .dmv-completed-documents-heading p { margin-top: 3px; color: #444; font-size: 0.875rem; }
        .dmv-completed-documents-heading > span {
          flex: none;
          color: #194e31;
          font-size: 0.8125rem;
          font-weight: 700;
        }
        .dmv-completed-document-list { margin: 0; padding: 0; list-style: none; }
        .dmv-completed-document {
          min-height: 68px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border: 1px solid #d8dde6;
          border-bottom: 0;
        }
        .dmv-completed-document:first-child { border-radius: 5px 5px 0 0; }
        .dmv-completed-document:last-child { border-bottom: 1px solid #d8dde6; border-radius: 0 0 5px 5px; }
        .dmv-completed-document-icon {
          flex: none;
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border: 1px solid #2e844a;
          border-radius: 50%;
          background: #e8f6ec;
          color: #194e31;
          font-weight: 700;
        }
        .dmv-file-preview-dialog {
          position: fixed;
          top: 50vh;
          left: 50vw;
          transform: translate(-50%, -50%);
          width: min(100% - 32px, 1000px);
          max-width: 1000px;
          max-height: min(90vh, 900px);
          margin: 0;
          padding: 0;
          overflow: hidden;
          border: 1px solid #b5c5d5;
          border-radius: 8px;
          background: #fff;
          color: #181818;
        }
        .dmv-file-preview-dialog::backdrop { background: rgb(3 45 96 / 55%); }
        .dmv-file-preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 18px;
          border-bottom: 1px solid #d8dde6;
        }
        .dmv-file-preview-header h2 { margin: 0; font-size: 1rem; font-weight: 700; }
        .dmv-file-preview-header p { margin: 3px 0 0; color: #444; font-size: 0.8125rem; overflow-wrap: anywhere; }
        .dmv-file-preview-actions { display: flex; align-items: center; gap: 8px; }
        .dmv-file-preview-content {
          height: min(72vh, 720px);
          display: grid;
          place-items: center;
          overflow: auto;
          padding: 16px;
          background: #f3f3f3;
        }
        .dmv-file-preview-content iframe { width: 100%; height: 100%; border: 0; background: #fff; }
        .dmv-file-preview-content img { max-width: 100%; max-height: 100%; object-fit: contain; }

        .dmv-card-actions {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
          padding-top: 16px;
          border-top: 1px solid #e5e5e5;
        }
        .dmv-fee-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 16px;
          border: 1px solid #d8dde6;
          border-radius: 5px;
          background: #f8f9fb;
          color: #333;
        }
        .dmv-fee-summary strong { color: #181818; font-size: 1.25rem; }
        .dmv-payment-options { max-width: 520px; }
        .dmv-complete-panel { display: flex; gap: 16px; padding: 24px 20px 10px; }
        .dmv-complete-icon {
          flex: none;
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #2e844a;
          color: #fff;
          font-size: 1.25rem;
          font-weight: 700;
        }
        .dmv-complete-panel h2 { margin: 0 0 6px; color: #194e31; font-size: 1.25rem; font-weight: 700; }
        .dmv-complete-panel p { color: #333; font-size: 0.9375rem; line-height: 1.55; }
        .dmv-complete-panel .dmv-reference { margin-top: 12px; color: #444; font-weight: 600; }
        .dmv-complete-panel + .dmv-card-actions { margin: 8px 20px 20px; }
        .dmv-announcement {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          clip-path: inset(50%);
        }

        @media (max-width: 1000px) {
          .dmv-demo-shell { padding-right: 20px; padding-left: 20px; }
          .dmv-step-list { gap: 8px; }
        }
        @media (max-width: 720px) {
          .dmv-demo-root { padding-top: 88px; }
          .dmv-utility-bar { min-height: 50px; gap: 10px; padding: 0 14px; }
          .dmv-brand { font-size: 1rem; }
          .dmv-utility-context { display: none; }
          .dmv-back-link { font-size: 0.8125rem; }
          .dmv-app-nav { min-height: 38px; gap: 18px; padding: 0 14px; font-size: 0.8125rem; }
          .dmv-nav-current { min-height: 38px; }
          .dmv-demo-shell { padding: 14px 14px 32px; }
          .dmv-page-heading { align-items: flex-start; flex-direction: column; gap: 12px; margin-bottom: 18px; }
          .dmv-page-heading-actions { width: 100%; justify-content: space-between; }
          .dmv-page-description { max-width: 570px; }
          .dmv-ticket-table .slds-truncate { white-space: normal; overflow-wrap: anywhere; }
          .dmv-case-banner, .dmv-progress-card { padding: 14px; }
          .dmv-step-list { grid-template-columns: 1fr 1fr; gap: 12px 8px; }
          .dmv-step-content { padding: 16px; }
          .dmv-demo-root .dmv-card .slds-card__header { padding: 11px 16px; }
          .dmv-document-row { flex-wrap: wrap; }
          .dmv-document-action { margin-left: 42px; }
          .dmv-completed-document {
            display: grid;
            grid-template-columns: 28px minmax(0, 1fr);
            align-items: start;
            gap: 8px 10px;
            padding: 10px 12px;
          }
          .dmv-completed-document-icon { grid-row: 1 / span 2; }
          .dmv-completed-document .dmv-document-copy { grid-column: 2; }
          .dmv-completed-document > .slds-button {
            grid-column: 2;
            justify-self: start;
            margin: 0;
          }
          .dmv-file-preview-dialog[open] {
            inset: 0;
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            max-width: none;
            max-height: none;
            transform: none;
            margin: 0;
            border: 0;
            border-radius: 0;
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
            display: flex;
            flex-direction: column;
          }
          .dmv-file-preview-header {
            align-items: stretch;
            flex-direction: column;
            gap: 10px;
            padding: 12px;
          }
          .dmv-file-preview-actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
          }
          .dmv-file-preview-actions > * {
            min-width: 0;
            width: auto;
            min-width: 7rem;
            justify-content: center;
            padding-right: 6px;
            padding-left: 6px;
            white-space: nowrap;
          }
          .dmv-file-preview-header > div:first-child { min-width: 0; overflow-wrap: anywhere; }
          .dmv-file-preview-content {
            flex: 1;
            min-height: 0;
            height: auto;
            padding: 12px;
          }
        }
        @media (max-width: 420px) {
          .dmv-demo-root { font-size: 0.9375rem; }
          .dmv-breadcrumbs { gap: 6px; font-size: 0.75rem; }
          .dmv-now-serving { gap: 8px; }
          .dmv-now-serving > strong { font-size: 1.2rem; }
          .dmv-customer-name { font-size: 1rem; }
          .dmv-step-list { grid-template-columns: 1fr; }
          .dmv-card-actions { justify-content: stretch; }
          .dmv-card-actions .slds-button { flex: 1; }
          .dmv-checklist legend span { display: block; float: none; margin-top: 2px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dmv-demo-root *, .dmv-demo-root *::before, .dmv-demo-root *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
