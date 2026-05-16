import { FormEvent, useEffect, useMemo, useState } from 'react';
import api from '../api';

type ModuleKey = 'items' | 'vendors' | 'indents' | 'mis' | 'rfqs';
type FieldType = 'text' | 'number' | 'select' | 'date' | 'checkbox';
type RecordValue = string | number | boolean | null | undefined | Record<string, unknown>;
type ModuleRecord = Record<string, RecordValue> & { id: string };
type FormState = Record<string, string | boolean>;
type ReferenceMap = Partial<Record<ModuleKey, ModuleRecord[]>>;

interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  reference?: ModuleKey;
  optionLabel?: (record: ModuleRecord) => string;
}

interface ColumnConfig {
  label: string;
  value: (record: ModuleRecord) => string;
}

interface ModuleConfig {
  key: ModuleKey;
  title: string;
  singular: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
  references?: ModuleKey[];
}

interface ModuleListPageProps {
  title: string;
  endpoint: string;
}

const formatCurrency = (value: RecordValue): string => {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '';
};

const formatDate = (value: RecordValue): string => {
  if (!value || typeof value !== 'string') {
    return '';
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
};

const nestedText = (record: ModuleRecord, relation: string, field: string): string => {
  const value = record[relation];
  if (!value || typeof value !== 'object') {
    return '';
  }

  const nestedValue = value[field];
  return nestedValue === undefined || nestedValue === null ? '' : String(nestedValue);
};

const labelItem = (record: ModuleRecord): string => String(record.name ?? 'Unnamed item');

const labelVendor = (record: ModuleRecord): string => String(record.name ?? 'Unnamed vendor');

const labelIndent = (record: ModuleRecord): string => {
  const itemName = nestedText(record, 'item', 'name');
  return `${String(record.requestNumber ?? 'Indent')} ${itemName ? `- ${itemName}` : ''}`.trim();
};

const moduleConfigs: Record<ModuleKey, ModuleConfig> = {
  items: {
    key: 'items',
    title: 'Items',
    singular: 'Item',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'text' },
      { name: 'unitPrice', label: 'Unit Price', type: 'number', required: true }
    ],
    columns: [
      { label: 'Name', value: (record) => String(record.name ?? '') },
      { label: 'Description', value: (record) => String(record.description ?? '') },
      { label: 'Unit Price', value: (record) => formatCurrency(record.unitPrice) }
    ]
  },
  vendors: {
    key: 'vendors',
    title: 'Vendors',
    singular: 'Vendor',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'contactEmail', label: 'Contact Email', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'isActive', label: 'Active', type: 'checkbox' }
    ],
    columns: [
      { label: 'Name', value: (record) => String(record.name ?? '') },
      { label: 'Email', value: (record) => String(record.contactEmail ?? '') },
      { label: 'Phone', value: (record) => String(record.phone ?? '') },
      { label: 'Status', value: (record) => (record.isActive === false ? 'Inactive' : 'Active') }
    ]
  },
  indents: {
    key: 'indents',
    title: 'Indents',
    singular: 'Indent',
    references: ['items'],
    fields: [
      { name: 'requestNumber', label: 'Request Number', type: 'text', required: true },
      { name: 'itemId', label: 'Item', type: 'select', required: true, reference: 'items', optionLabel: labelItem },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['OPEN', 'APPROVED', 'REJECTED'] }
    ],
    columns: [
      { label: 'Request No.', value: (record) => String(record.requestNumber ?? '') },
      { label: 'Item', value: (record) => nestedText(record, 'item', 'name') },
      { label: 'Quantity', value: (record) => String(record.quantity ?? '') },
      { label: 'Status', value: (record) => String(record.status ?? '') },
      { label: 'Requested By', value: (record) => nestedText(record, 'requestedBy', 'fullName') }
    ]
  },
  mis: {
    key: 'mis',
    title: 'MI',
    singular: 'MI',
    references: ['indents'],
    fields: [
      { name: 'number', label: 'MI Number', type: 'text', required: true },
      { name: 'indentId', label: 'Indent', type: 'select', required: true, reference: 'indents', optionLabel: labelIndent },
      { name: 'receivedQty', label: 'Received Qty', type: 'number', required: true },
      { name: 'receivedAt', label: 'Received At', type: 'date', required: true }
    ],
    columns: [
      { label: 'MI No.', value: (record) => String(record.number ?? '') },
      { label: 'Indent', value: (record) => nestedText(record, 'indent', 'requestNumber') },
      { label: 'Received Qty', value: (record) => String(record.receivedQty ?? '') },
      { label: 'Received At', value: (record) => formatDate(record.receivedAt) }
    ]
  },
  rfqs: {
    key: 'rfqs',
    title: 'RFQ',
    singular: 'RFQ',
    references: ['items', 'vendors'],
    fields: [
      { name: 'number', label: 'RFQ Number', type: 'text', required: true },
      { name: 'itemId', label: 'Item', type: 'select', required: true, reference: 'items', optionLabel: labelItem },
      { name: 'vendorId', label: 'Vendor', type: 'select', required: true, reference: 'vendors', optionLabel: labelVendor },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'quotedPrice', label: 'Quoted Price', type: 'number', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'SENT', 'CLOSED'] }
    ],
    columns: [
      { label: 'RFQ No.', value: (record) => String(record.number ?? '') },
      { label: 'Item', value: (record) => nestedText(record, 'item', 'name') },
      { label: 'Vendor', value: (record) => nestedText(record, 'vendor', 'name') },
      { label: 'Quantity', value: (record) => String(record.quantity ?? '') },
      { label: 'Quoted Price', value: (record) => formatCurrency(record.quotedPrice) },
      { label: 'Status', value: (record) => String(record.status ?? '') }
    ]
  }
};

const emptyForm = (config: ModuleConfig): FormState =>
  config.fields.reduce<FormState>((state, field) => {
    state[field.name] = field.type === 'checkbox' ? true : '';
    return state;
  }, {});

const recordToForm = (config: ModuleConfig, record: ModuleRecord): FormState =>
  config.fields.reduce<FormState>((state, field) => {
    const value = record[field.name];

    if (field.type === 'checkbox') {
      state[field.name] = value !== false;
    } else if (field.type === 'date' && typeof value === 'string') {
      state[field.name] = value.slice(0, 10);
    } else if (value === undefined || value === null) {
      state[field.name] = '';
    } else {
      state[field.name] = String(value);
    }

    return state;
  }, {});

const normalizePayload = (config: ModuleConfig, form: FormState): Record<string, string | number | boolean> => {
  return config.fields.reduce<Record<string, string | number | boolean>>((payload, field) => {
    const value = form[field.name];

    if (field.type === 'checkbox') {
      payload[field.name] = Boolean(value);
      return payload;
    }

    if (value === '') {
      return payload;
    }

    if (field.type === 'number') {
      payload[field.name] = Number(value);
    } else if (typeof value === 'string') {
      payload[field.name] = value;
    }

    return payload;
  }, {});
};

const errorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string | string[] } } }).response;
    const message = response?.data?.message;
    if (Array.isArray(message)) {
      return message.join(', ');
    }
    if (message) {
      return message;
    }
  }

  return 'Request failed';
};

export function ModuleListPage({ title, endpoint }: ModuleListPageProps): JSX.Element {
  const config = moduleConfigs[endpoint as ModuleKey] ?? moduleConfigs.items;
  const isAdmin = localStorage.getItem('role') === 'ADMIN';
  const canCreate = isAdmin || config.key === 'indents';
  const canModify = isAdmin;
  const [records, setRecords] = useState<ModuleRecord[]>([]);
  const [references, setReferences] = useState<ReferenceMap>({});
  const [form, setForm] = useState<FormState>(() => emptyForm(config));
  const [editing, setEditing] = useState<ModuleRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const pageTitle = title || config.title;

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [{ data }, ...referenceResponses] = await Promise.all([
        api.get<ModuleRecord[]>(`/${config.key}`),
        ...(config.references ?? []).map((reference) => api.get<ModuleRecord[]>(`/${reference}`))
      ]);
      const nextReferences: ReferenceMap = {};
      (config.references ?? []).forEach((reference, index) => {
        nextReferences[reference] = referenceResponses[index].data;
      });
      setRecords(data);
      setReferences(nextReferences);
    } catch (err) {
      setError(errorMessage(err));
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm(emptyForm(config));
    setEditing(null);
    setMessage('');
    void load();
  }, [config.key]);

  const visibleFields = useMemo(() => {
    if (config.key === 'vendors' && !editing) {
      return config.fields.filter((field) => field.name !== 'isActive');
    }
    return config.fields;
  }, [config, editing]);

  const resetForm = () => {
    setForm(emptyForm(config));
    setEditing(null);
    setMessage('');
    setError('');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCreate && !editing) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      if (editing) {
        const payload = normalizePayload(config, form);
        await api.patch(`/${config.key}/${editing.id}`, payload);
        setMessage(`${config.singular} updated`);
      } else {
        const payload = normalizePayload({ ...config, fields: visibleFields }, form);
        await api.post(`/${config.key}`, payload);
        setMessage(`${config.singular} created`);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (record: ModuleRecord) => {
    setEditing(record);
    setForm(recordToForm(config, record));
    setMessage('');
    setError('');
  };

  const remove = async (record: ModuleRecord) => {
    const label = config.columns[0]?.value(record) || config.singular;
    if (!window.confirm(`Delete ${label}?`)) {
      return;
    }

    setError('');
    setMessage('');
    try {
      await api.delete(`/${config.key}/${record.id}`);
      setMessage(`${config.singular} deleted`);
      await load();
      if (editing?.id === record.id) {
        resetForm();
      }
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <main className="module-page">
      <div className="module-header">
        <div>
          <h2>{pageTitle}</h2>
          <p>{canModify ? 'Create, edit, and remove records.' : config.key === 'indents' ? 'Create indents and review existing records.' : 'Review records. Admin role is required for changes.'}</p>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading}>
          Refresh
        </button>
      </div>

      <section className="form-panel" aria-label={`${config.singular} form`}>
        <div className="section-title">
          <h3>{editing ? `Edit ${config.singular}` : `New ${config.singular}`}</h3>
          {editing && (
            <button type="button" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>

        {!canCreate && !editing && <p className="notice">Admin role is required to create {config.title.toLowerCase()}.</p>}

        <form onSubmit={submit} className="crud-form">
          {visibleFields.map((field) => (
            <label key={field.name} className={field.type === 'checkbox' ? 'checkbox-field' : undefined}>
              <span>{field.label}</span>
              {field.type === 'select' ? (
                <select
                  value={String(form[field.name] ?? '')}
                  required={field.required}
                  disabled={!canCreate && !editing}
                  onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                >
                  <option value="">Select {field.label}</option>
                  {field.reference
                    ? (references[field.reference] ?? []).map((record) => (
                        <option key={record.id} value={record.id}>
                          {field.optionLabel ? field.optionLabel(record) : record.id}
                        </option>
                      ))
                    : field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  checked={Boolean(form[field.name])}
                  disabled={!canCreate && !editing}
                  onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.checked }))}
                />
              ) : (
                <input
                  type={field.type}
                  min={field.type === 'number' ? 0 : undefined}
                  step={field.name.toLowerCase().includes('price') ? '0.01' : '1'}
                  value={String(form[field.name] ?? '')}
                  required={field.required}
                  disabled={!canCreate && !editing}
                  onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                />
              )}
            </label>
          ))}
          <div className="form-actions">
            <button type="submit" disabled={saving || (!canCreate && !editing) || (Boolean(editing) && !canModify)}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm}>
              Clear
            </button>
          </div>
        </form>
      </section>

      {(message || error) && <p className={error ? 'message error' : 'message'}>{error || message}</p>}

      <section className="table-panel" aria-label={`${config.title} records`}>
        {loading ? (
          <p>Loading {config.title.toLowerCase()}...</p>
        ) : records.length === 0 ? (
          <p>No {config.title.toLowerCase()} found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {config.columns.map((column) => (
                    <th key={column.label}>{column.label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    {config.columns.map((column) => (
                      <td key={column.label}>{column.value(record)}</td>
                    ))}
                    <td className="row-actions">
                      <button type="button" onClick={() => startEdit(record)} disabled={!canModify}>
                        Edit
                      </button>
                      <button type="button" onClick={() => void remove(record)} disabled={!canModify}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
