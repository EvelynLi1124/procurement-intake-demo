import { useState, type ReactNode } from 'react'
import { Icon } from '../components/Icon'
import {
  Accordion, Alert, Card, CountTag, DatePicker, Dropdown, FieldCard, FieldRow, Modal, Pill, PrimaryButton, Radio,
  ScrollArea, SecondaryButton, SmallTag, StatusTag, Stepper, TertiaryButton, TextArea, TextInput, TextLink, YesNo,
  type Step,
} from '../components/ui'
import { intakeSteps, scopeSteps, screeningOnly, screeningSteps } from './steps'
import './screens.css'

export type Nav = (to: string) => void
const NOT_DEFINED = 'Destination not defined in Figma'

/* ---------- Layout wrappers ---------- */
// Figma: content is top-aligned (HUG) on 1.1–1.5 and 1.8, vertically centred (FILL + CENTER) on 1.6.x and 1.7.x.
function Panel({ steps, children, center = false, top, inset }: { steps: Step[]; children: ReactNode; center?: boolean; top?: ReactNode; inset?: boolean }) {
  return (
    <div className="right-container">
      <Stepper steps={steps} inset={inset} />
      {top}
      <div className={center ? 'right-center' : 'right-top'}>{children}</div>
    </div>
  )
}

function CreateNewRow() {
  return (
    <div className="create-new-row">
      <button className="create-new" title={NOT_DEFINED}>
        <Icon name="add-file-red-24" />
        <span>Create new</span>
      </button>
    </div>
  )
}

const BackHome = ({ nav, label = 'Back to Homepage' }: { nav: Nav; label?: string }) => (
  <TertiaryButton onClick={() => nav('0')}>{label}</TertiaryButton>
)
const SaveForNow = () => <TertiaryButton icon="save-file-24" title={NOT_DEFINED}>Save for now</TertiaryButton>

/* ---------- 0 Landing ---------- */
const LANDING = [
  { icon: 'add-file-40', h: 'Set up a new contract', s: 'Create a new agreement with a supplier', to: '1.1' },
  { icon: 'weight-management-40', h: 'Renew, amend, or terminate an existing contract' },
  { icon: 'mobile-laptop-40', h: 'Purchase software' },
  { icon: 'payment-order-40', h: 'Find how to buy something', s: 'Get guidance on where and how to purchase a product or service' },
  { icon: 'calendar-40', h: 'Set up a meeting/event' },
  { icon: 'airplane-40', h: 'Book travel' },
  { icon: 'login-1-40', h: 'Hire/manage a contingent worker', s: 'E.g. recruit/manage a new contractor, manage a SOW worker, etc.' },
]
export function Landing({ nav }: { nav: Nav }) {
  return (
    <div className="landing">
      {LANDING.map((c) => (
        <button
          key={c.h}
          className={'landing-card' + (c.to ? ' is-live' : '')}
          onClick={() => c.to && nav(c.to)}
          title={c.to ? undefined : 'Covered by a later flow'}
        >
          <Icon name={c.icon} />
          <span className="landing-text">
            <span className="landing-h">{c.h}</span>
            {c.s && <span className="landing-s">{c.s}</span>}
          </span>
        </button>
      ))}
    </div>
  )
}

/* ---------- 1.1 / 1.2 / 1.2.1 Contract request details (disabled preview) ---------- */
export function RequestDetailsPreview({ steps }: { steps: Step[] }) {
  return (
    <Panel steps={steps}>
      <Card title="Contract request details">
        <div className="info-col" style={{ gap: 8 }}>
          <p>As we chat, I'll capture the information needed to help set up your contract. You can review and update these details at any time.</p>
          <div className="field-list">
            <FieldCard status="unchecked"><Dropdown disabled label="What type of request is it?" value="Select contract request type" /></FieldCard>
            <FieldCard status="unchecked"><Dropdown disabled label="What category best describes your request?" value="Select " /></FieldCard>
            <FieldCard status="unchecked"><TextInput disabled label="Supplier name" placeholder="Enter supplier name" /></FieldCard>
            <FieldCard status="unchecked">
              <TextInput disabled label="What is the estimated spend over the full-term of the contract?" placeholder="Enter number" grow={4} />
              <Dropdown disabled label="Currency" value="CAD" grow={1} />
            </FieldCard>
            <FieldCard status="unchecked"><Dropdown disabled label="Which Manulife Legal Entity will contract with the supplier?" value="Manulife Life Insurance Company" /></FieldCard>
          </div>
        </div>
      </Card>
    </Panel>
  )
}
export const Screen11 = () => <RequestDetailsPreview steps={screeningSteps('0%')} />
export const Screen12 = () => <RequestDetailsPreview steps={screeningSteps('0%')} />
export const Screen121 = () => <RequestDetailsPreview steps={screeningOnly} />

/* ---------- 1.3 Missing information ---------- */
export function Screen13({ nav }: { nav: Nav }) {
  return (
    <Panel steps={screeningSteps('65%')}>
      <Card
        title="Help me complete your request"
        footer={<><BackHome nav={nav} /><PrimaryButton onClick={() => nav('1.4')}>Continue</PrimaryButton></>}
      >
        <ScrollArea gap={12} barGap={0}>
          <p>
            <b>Review</b> the information below and update or complete any highlighted items.<br />
            Once you're ready, select <b>Continue</b> and I'll determine the next steps for your request.
          </p>
          <Alert heading="Missing information">
            Please provide information for <b>Contract request type</b>, <b>Supplier name</b>, and <b>Estimated spend / Currency.</b>
          </Alert>
          <FieldCard status="warning"><Dropdown label="What type of request is it?" value="Select contract request type" /></FieldCard>
          <FieldCard status="check"><Dropdown label="What category best describes your request?" value="Select " /></FieldCard>
          <FieldCard status="warning"><TextInput label="Supplier name" placeholder="Enter supplier name" /></FieldCard>
          <FieldCard status="warning">
            <TextInput label="What is the estimated spend over the full-term of the contract?" placeholder="Enter number" grow={4} />
            <Dropdown label="Currency" value="CAD" grow={1} />
          </FieldCard>
          <FieldCard status="circle-check"><Dropdown label="Which Manulife Legal Entity will contract with the supplier?" value="Manulife Life Insurance Company" /></FieldCard>
        </ScrollArea>
      </Card>
    </Panel>
  )
}

/* ---------- 1.4 Confirm supplier ---------- */
const SUPPLIERS = [
  { n: 'INSIGHT CANADA INC', active: true, r: 'CA' },
  { n: 'INSIGHT GLOBAL CANADA INC', active: true, r: 'CA' },
  { n: 'CORPORATE INSIGHT INC', active: true, r: 'HK' },
  { n: 'CWFS INSIGHT LLC', active: false, r: 'US' },
  { n: 'FC CANADA', active: false, r: 'CA' },
]
export function Screen14({ nav }: { nav: Nav }) {
  const [sel, setSel] = useState<string>()
  return (
    <Panel steps={screeningSteps('75%')}>
      <Card
        title="Help me complete your request"
        footer={<><BackHome nav={nav} /><PrimaryButton onClick={() => nav('1.5')}>Continue</PrimaryButton></>}
      >
        <p>I found possible matches for the supplier name in our records. Please help me to confirm the supplier.</p>
        <div className="radio-list">
          <div className="field-label">Please select your supplier </div>
          <div className="radio-group">
            {SUPPLIERS.map((s) => (
              <Radio key={s.n} checked={sel === s.n} onChange={() => setSel(s.n)}>
                <span className="supplier-label">
                  <span className="supplier-name">
                    {s.n}
                    <SmallTag tone={s.active ? 'green' : 'light'}>{s.active ? 'P2P Active' : 'P2P Inactive'}</SmallTag>
                  </span>
                  <i>Contracting region: {s.r}</i>
                </span>
              </Radio>
            ))}
            <Radio checked={sel === 'none'} onChange={() => setSel('none')} align="center">None of the above/ I’m not sure</Radio>
          </div>
        </div>
      </Card>
    </Panel>
  )
}

/* ---------- 1.5 Confirm supplier by contract ---------- */
function Caption({ icon, label, value, labelColor = '#272a38' }: { icon?: string; label: string; value: string; labelColor?: string }) {
  return (
    <span className="caption">
      <span className="caption-type">
        {icon && <Icon name={icon} />}
        <b style={{ color: labelColor }}>{label}</b>
      </span>
      <span>{value}</span>
    </span>
  )
}
function ContractTile({ active, selected, onSelect }: { active: boolean; selected: boolean; onSelect: () => void }) {
  return (
    <button className={'tile' + (selected ? ' selected' : '')} onClick={onSelect} aria-pressed={selected}>
      <span className="tile-title">
        <span>Contract name</span>
        <StatusTag active={active} />
      </span>
      <span className="captions">
        <Caption label="Contract ID" value="#0000000" labelColor="#34384b" />
        <Caption icon="location-20" label="Supplier country" value="Singapore" />
        <Caption icon="calendar-20" label="Contract end date" value="DD, MM, YYYY" />
      </span>
      <span className="captions">
        <Caption icon="money-bag-20" label="Spend" value="9000 CAD" />
        <Caption icon="fund-switches-20" label="Cost center" value="8150" />
        <Caption icon="login-1-20" label="Cost center owner/ sponsor" value="Michaela_MK" />
      </span>
      <span className="tile-desc">
        <b>Intake description: </b>Intake description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do{' '}
      </span>
    </button>
  )
}
export function Screen15({ nav }: { nav: Nav }) {
  const [sel, setSel] = useState<number>()
  return (
    <Panel steps={screeningSteps('80%')}>
      <Card
        title="Help me complete your request"
        footer={<><BackHome nav={nav} /><PrimaryButton onClick={() => nav('1.6')}>Continue</PrimaryButton></>}
      >
        <p>
          I found several contracts with <b>[Supplier Name]</b>. To help us ensure that we've selected the correct supplier please select the contract that best matches previous engagements with <b>[Supplier Name]</b>.
          <br /><br />
          <b>If you're unsure, select None of the above/ I'm not sure</b>. I'll keep all matching contracts in consideration and continue gathering information to help identify the correct one.
        </p>
        <div className="tiles">
          {[true, true, false, false].map((a, i) => (
            <ContractTile key={i} active={a} selected={sel === i} onSelect={() => setSel(i)} />
          ))}
          <button className={'tile tile-none' + (sel === 4 ? ' selected' : '')} onClick={() => setSel(4)} aria-pressed={sel === 4}>
            None of the above/ I’m not sure
          </button>
        </div>
      </Card>
    </Panel>
  )
}

/* ---------- 1.6 / 1.6.1 In scope ---------- */
function InScopeCard({ nav, next }: { nav: Nav; next: string }) {
  return (
    <Card
      title="Let's get your contract request started"
      footer={<><BackHome nav={nav} /><PrimaryButton onClick={() => nav(next)}>Continue</PrimaryButton></>}
    >
      <div className="info-col">
        <p>
          Good news! I've already captured some of the information needed to get started.<br />
          Next, I'll guide you through a few additional questions to help complete your request. Depending on your answers, you may also be asked to provide information about potential business, security, privacy, or regulatory considerations.
        </p>
        <p>Want to learn more about how Procurement reviews these types of requests? Learn more <TextLink>here</TextLink>.</p>
      </div>
    </Card>
  )
}
export const Screen16 = ({ nav }: { nav: Nav }) => (
  <Panel steps={scopeSteps} center inset><InScopeCard nav={nav} next="1.7" /></Panel>
)
export const Screen161 = ({ nav }: { nav: Nav }) => (
  <Panel steps={scopeSteps} top={<CreateNewRow />} center inset><InScopeCard nav={nav} next="1.7.1" /></Panel>
)

/* ---------- 1.6.2 – 1.6.8, 1.8.1 Outcome cards ---------- */
const NeedDifferent = ({ text }: { text: string }) => (
  <p><b>Need something different?</b> {text}</p>
)
const NEW_CONTRACT = 'If your request requires a new contract, you can continue with the contract request process.'

export function OutcomeCard({ id, nav }: { id: string; nav: Nav }) {
  const continueBtn = <TertiaryButton title={NOT_DEFINED}>Continue</TertiaryButton>
  const map: Record<string, { title: string; body: ReactNode; cta: ReactNode }> = {
    '1.6.2': {
      title: 'Your purchase qualifies for a Direct Purchase ',
      body: (
        <>
          <p>Based on the information provided, this purchase qualifies as a Direct Purchase. A Direct Purchase allows you<br />to buy products or services using a Purchase Order (PO) without a negotiated contract.</p>
          <p>The next step is to create a non-catalog Purchase Requisition (PR) in Ivalua to initiate your request.</p>
          <p><TextLink size={18}>Learn more about Direct Purchases</TextLink></p>
          <p><TextLink size={18}>Learn how to create a non-catalog requisition</TextLink></p>
        </>
      ),
      cta: <><SecondaryButton hug title={NOT_DEFINED}>Negotiated contract</SecondaryButton><PrimaryButton external title={NOT_DEFINED}>Ivalua Purchase Requisition</PrimaryButton></>,
    },
    '1.6.3': {
      title: "I've found a simpler way to complete your purchase ",
      body: (
        <>
          <p>Based on the information provided, it looks like there's already an agreement in place with this supplier. To place your order, work directly with the supplier and use a Treasury payment application to process the invoice.</p>
          <p><TextLink size={18}>Learn more</TextLink> about Treasury applications.</p>
          <NeedDifferent text={NEW_CONTRACT} />
        </>
      ),
      cta: <>{continueBtn}<SecondaryButton external title={NOT_DEFINED}>Learn more</SecondaryButton></>,
    },
    '1.6.4': {
      title: "There's an easier way to get what you need",
      body: (
        <>
          <p>Based on the information provided, this request can be completed through an existing process. Please start your purchase from the <TextLink size={18}>Ivalua Procure-to-Pay</TextLink> Marketplace. <br /><TextLink size={18}>Learn more</TextLink> about Ivalua Procure-to-Pay.</p>
          <NeedDifferent text="If your request still requires a contract, you can continue with the contract request process." />
        </>
      ),
      cta: <>{continueBtn}<PrimaryButton external title={NOT_DEFINED}>Go to Ivalua P2P</PrimaryButton></>,
    },
    '1.6.5': {
      title: "You're ready to place your order ",
      body: (
        <>
          <p>Based on the information provided, it looks like there's already an agreement in place with this supplier and you're ready to proceed with your purchase. The next step is to create a non-catalog requisition in Ivalua.</p>
          <p>Learn <TextLink size={18}>how to create a non-catalog requisition</TextLink>.</p>
          <NeedDifferent text={NEW_CONTRACT} />
        </>
      ),
      cta: <>{continueBtn}<SecondaryButton external title={NOT_DEFINED}>Learn more</SecondaryButton></>,
    },
    '1.6.6': {
      title: 'Your request should be managed outside of procurement',
      body: (
        <>
          <p>Based on the information provided, Procurement support is not required for this request: I've identified this as a business-managed purchase. <br />To determine the appropriate process and next steps, please visit the <TextLink size={18}>Business-Managed Purchases</TextLink> page. </p>
          <div>
            <p>There you'll find: </p>
            <ul>
              <li>Guidance for this type of purchase </li>
              <li>Ownership and support information </li>
              <li>Recommended next steps </li>
            </ul>
          </div>
        </>
      ),
      cta: <><BackHome nav={nav} label="Back to Homepage " /><PrimaryButton external title={NOT_DEFINED}>Business managed purchases</PrimaryButton></>,
    },
    '1.6.7': {
      title: 'Your request should be handled locally ',
      body: (
        <>
          <p>Based on the information provided, requests for [Country] are managed through a different process.</p>
          <p>To continue, please get in touch with your local Procurement Team.</p>
        </>
      ),
      cta: <PrimaryButton title={NOT_DEFINED}>Confirm</PrimaryButton>,
    },
    '1.6.8': {
      title: "There's an easier way to get what you need",
      body: (
        <>
          <p>Based on the information provided, this request can be completed through <TextLink size={18}>Ivalua Procure-to-Pay</TextLink>. <br /><TextLink size={18}>Learn more</TextLink> about Ivalua Procure-to-Pay.</p>
          <NeedDifferent text="If your request still requires a contract, you can continue with the contract request process." />
        </>
      ),
      cta: <>{continueBtn}<PrimaryButton external title={NOT_DEFINED}>Go to Ivalua P2P</PrimaryButton></>,
    },
  }
  const c = map[id === '1.8.1' ? '1.6.2' : id]
  return (
    <Panel steps={scopeSteps} center>
      <Card title={c.title} footer={c.cta}>
        <div className="info-col" style={{ gap: 8 }}>{c.body}</div>
      </Card>
    </Panel>
  )
}

/* ---------- 1.7 PSQ questions ---------- */
const PSQ = [
  'Will the Third Party have access to, process, or store any Manulife information and/or data?',
  'Will the Third Party be using any type of Artificial Intelligence (AI) capabilities/services including AI model and/or AI system to Manulife?',
  'Does the Third Party support a critical operation?',
]
export function Screen17({ nav }: { nav: Nav }) {
  return (
    <Panel steps={intakeSteps('80%')} center inset>
      <Card
        title="Help me complete your request"
        titleColor="#000"
        contentPad="0 0 0 12px"
        footer={<><SaveForNow /><PrimaryButton onClick={() => nav('1.8')}>Continue</PrimaryButton></>}
      >
        <ScrollArea gap={16}>
          <p>Review and validate the PSQ questions below. Update or complete any highlighted items.<br />Once you're ready, select Continue and I'll determine the next steps for your request.</p>
          <div className="section-title-row">
            <span className="section-title">PSQ questions</span>
            <CountTag tone="coral">0/3 completed</CountTag>
          </div>
          {PSQ.map((q) => (
            <FieldCard key={q} status="warning"><YesNo label={q} /></FieldCard>
          ))}
        </ScrollArea>
      </Card>
    </Panel>
  )
}

/* ---------- 1.7.1 Intake summary (collapsed) ---------- */
function ExportButton() {
  return (
    <button className="action-button" title={NOT_DEFINED}>
      <Icon name="export-20" />
      <span>Export</span>
    </button>
  )
}
export function Screen171() {
  return (
    <Panel steps={intakeSteps('100%')} top={<CreateNewRow />} center inset>
        <Card
          title="Help me complete your request"
          titleRight={<ExportButton />}
          contentPad="0 0 0 12px"
          footer={<><SaveForNow /><PrimaryButton hug title={NOT_DEFINED}>Confirm &amp; Proceed</PrimaryButton></>}
        >
          <ScrollArea gap={12}>
            <p>Review the information below and update or complete any highlighted items.</p>
            <Accordion title="Intake details" tag={<CountTag tone="gold">6/9 completed</CountTag>} defaultOpen={false}>
              <p className="muted-note">Accordion content is not designed in Figma for this screen.</p>
            </Accordion>
          </ScrollArea>
        </Card>
    </Panel>
  )
}

/* ---------- 1.8 / 1.9 Intake details ---------- */
type F = { key: string; status: 'warning' | 'check'; node: ReactNode }
const SECTIONS: { title: string; tag: string; tone: 'green' | 'gold'; fields: F[] }[] = [
  {
    title: 'General information', tag: '4/4 completed', tone: 'green', fields: [
      { key: 'name', status: 'check', node: <TextInput label="Give your request a name" defaultValue="Salesforce CRM Upgrade" /> },
      { key: 'obj', status: 'check', node: <TextInput label="Business objective" help="The business outcome or problem being solved. Why is this procurement needed? What pain points, strategic goals, or improvements are targeted? Example: 'Reduce customer response times by 40% and improve satisfaction scores'." defaultValue="Reduce customer response times and improve satisfaction" /> },
      { key: 'opt', status: 'check', node: <Dropdown label="What option best describes your request?" optional value="I know the supplier and need a contract ( or change)" /> },
      { key: 'type', status: 'check', node: <Dropdown label="What type of request is it?" optional value="Select contract request type" /> },
    ],
  },
  {
    title: 'Supplier details', tag: '2/4 completed', tone: 'gold', fields: [
      { key: 'new', status: 'check', node: <YesNo label="Is it a new supplier?" initial="Yes" gap={10} /> },
      { key: 'sname', status: 'check', node: <TextInput label="Supplier name" defaultValue="Northstar Analytics Ltd." /> },
      { key: 'email', status: 'warning', node: <TextInput label="Vendor contact email" defaultValue="vendor@example.com" /> },
      { key: 'sdet', status: 'warning', node: <TextArea label="Supplier details" help="Add more details about the new supplier, including Contact details, address, phone, TAX ID / DUNS, supplier background and capabilities" placeholder="Contact details, address, phone, TAX ID / DUNS, supplier background and capabilities" /> },
    ],
  },
  {
    title: 'Spend details', tag: '3/3 completed', tone: 'green', fields: [
      { key: 'cat', status: 'check', node: <Dropdown label="What category best describes your request?" value="Select " /> },
      { key: 'spend', status: 'check', node: <FieldRow><TextInput label="What is the estimated spend over the full-term of the contract?" placeholder="Enter number" grow={4} /><Dropdown label="Currency" value="CAD" grow={1} /></FieldRow> },
    ],
  },
  {
    title: 'Contracting details', tag: '1/6 completed', tone: 'gold', fields: [
      { key: 'cm', status: 'warning', node: <Dropdown label="Contract Manager" help="Contract Manager: The person who ensures the vendor’s compliance to the contract" value="Select a contract manager" /> },
      { key: 'po', status: 'warning', node: <Dropdown label="Project Owner" help="Project Owner: The person who owns the delivery of the business initiative" value="Select a project owner" /> },
      { key: 'cc', status: 'warning', node: <Dropdown label="Project Owner Cost Center" value="Select a cost center" /> },
      { key: 'le', status: 'check', node: <Dropdown label="Which Manulife Legal Entity will contract with the supplier?" value="Select Manulife Legal Entity" /> },
      { key: 'date', status: 'warning', node: <DatePicker label="When do you expect the contract to be executed or signed?" optional /> },
      { key: 'bu', status: 'warning', node: <Dropdown label="Vendor Management Business Unit" optional help="If you are not certain, or do not see your BU listed, please reach out to your local contract management team or select Not Assigned." value="Select your business unit" /> },
    ],
  },
]

// 1.9 (behind the modal) shows a different data state in Figma: tags/icons below.
const CONFIRMED_TAGS: Record<string, { tag: string; tone: 'green' | 'gold' }> = {
  'General information': { tag: '4/4 completed', tone: 'green' },
  'Supplier details': { tag: '4/4 completed', tone: 'gold' },
  'Spend details': { tag: '3/3 completed', tone: 'gold' },
  'Contracting details': { tag: '5/6 completed', tone: 'gold' },
}
const CONFIRMED_WARNING = new Set(['date'])

export function IntakeDetails({ nav, confirmed }: { nav: Nav; confirmed?: boolean }) {
  const [filter, setFilter] = useState<'all' | 'missing'>('all')
  return (
    <Panel steps={intakeSteps('100%')} inset>
      <Card
        title="Help me complete your intake request"
        titleColor="#000"
        contentPad="0 0 0 12px"
        footer={<><SaveForNow /><PrimaryButton hug onClick={() => nav('1.9')}>Confirm &amp; Proceed</PrimaryButton></>}
      >
        {/* Figma (updated): intro, title, alert and pills scroll together with the sections (frame gap 16). */}
        <ScrollArea gap={16}>
          <p>Review the information below and update or complete any highlighted items.</p>
          <div className="section-title-row">
            <span className="intake-title">Intake details</span>
            <CountTag tone={confirmed ? 'green' : 'gold'}>{confirmed ? '17/17 completed' : '10/17 completed'}</CountTag>
          </div>
          <div className="info-col" style={{ gap: 8 }}>
            {!confirmed && (
              <Alert heading="Provide the missing information to continue">
                <ul><li>17 fields in this intake</li><li>7 fields missing</li></ul>
              </Alert>
            )}
            <div className="pill-group">
              <Pill selected={filter === 'all'} onClick={() => setFilter('all')}>Review all fields (21)</Pill>
              <Pill selected={filter === 'missing'} onClick={() => setFilter('missing')}>Review missing fields ({confirmed ? 15 : 7})</Pill>
            </div>
          </div>
          {SECTIONS.map((s) => {
            const status = (f: F): F['status'] => (confirmed ? (CONFIRMED_WARNING.has(f.key) ? 'warning' : 'check') : f.status)
            const fields = s.fields.filter((f) => filter === 'all' || status(f) === 'warning')
            if (!fields.length) return null
            const t = confirmed ? CONFIRMED_TAGS[s.title] : s
            return (
              <Accordion key={s.title} title={s.title} tag={<CountTag tone={t.tone}>{t.tag}</CountTag>}>
                {fields.map((f) => <FieldCard key={f.key} status={status(f)}>{f.node}</FieldCard>)}
              </Accordion>
            )
          })}
        </ScrollArea>
      </Card>
    </Panel>
  )
}

export function ConfirmModal({ nav }: { nav: Nav }) {
  return (
    <Modal onClose={() => nav('1.8')}>
      <div className="modal-text">
        <h2 className="modal-heading">Review and Confirm</h2>
        <p>Please confirm that you've reviewed the information provided and that it is accurate to the best of your knowledge.</p>
      </div>
      <div className="modal-buttons">
        <SecondaryButton onClick={() => nav('1.8')}>Return to review</SecondaryButton>
        <PrimaryButton onClick={() => nav('8.1')}>Confirm</PrimaryButton>
      </div>
    </Modal>
  )
}
