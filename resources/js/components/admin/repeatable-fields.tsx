import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export type RepeatableFieldDefinition = {
    key: string;
    label: string;
    placeholder: string;
    required?: boolean;
    multiline?: boolean;
};

type Row = { rowKey: number; values: Record<string, string | null> };

type RepeatableFieldsProps = {
    /** Input name prefix, e.g. "capabilities" submits capabilities[0][title]. */
    name: string;
    fields: RepeatableFieldDefinition[];
    initialRows: Record<string, string | null>[];
    errors: Record<string, string | undefined>;
    addLabel: string;
    maxRows: number;
};

let nextRowKey = 0;

function toRows(
    rows: Record<string, string | null>[],
    fields: RepeatableFieldDefinition[],
): Row[] {
    const source =
        rows.length > 0
            ? rows
            : [Object.fromEntries(fields.map((field) => [field.key, '']))];

    return source.map((values) => ({ values, rowKey: nextRowKey++ }));
}

/**
 * A list of field groups the admin can add and remove (e.g. capabilities,
 * methodology steps, results). Empty rows are dropped on the server.
 */
export function RepeatableFields({
    name,
    fields,
    initialRows,
    errors,
    addLabel,
    maxRows,
}: RepeatableFieldsProps) {
    const [rows, setRows] = useState<Row[]>(() => toRows(initialRows, fields));
    const isWide = fields.some((field) => field.multiline);

    return (
        <FieldGroup className="gap-4">
            {rows.map((row, position) => {
                const rowError = fields
                    .map((field) => errors[`${name}.${position}.${field.key}`])
                    .find(Boolean);

                return (
                    <div
                        key={row.rowKey}
                        className="flex flex-col gap-3 rounded-xl bg-muted p-4"
                    >
                        <div className="flex items-start gap-3">
                            <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-card text-xs font-semibold text-muted-foreground">
                                {position + 1}
                            </span>
                            <div
                                className={
                                    isWide
                                        ? 'flex flex-1 flex-col gap-3'
                                        : 'grid flex-1 gap-3 sm:grid-cols-2'
                                }
                            >
                                {fields.map((field) => {
                                    const id = `${name}-${row.rowKey}-${field.key}`;
                                    const inputName = `${name}[${position}][${field.key}]`;
                                    const defaultValue =
                                        row.values[field.key] ?? '';

                                    return (
                                        <FormField
                                            key={field.key}
                                            label={field.label}
                                            htmlFor={id}
                                            required={field.required}
                                        >
                                            {field.multiline ? (
                                                <Textarea
                                                    id={id}
                                                    name={inputName}
                                                    rows={2}
                                                    className="min-h-16"
                                                    defaultValue={defaultValue}
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                />
                                            ) : (
                                                <Input
                                                    id={id}
                                                    name={inputName}
                                                    defaultValue={defaultValue}
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                />
                                            )}
                                        </FormField>
                                    );
                                })}
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="mt-6"
                                onClick={() =>
                                    setRows((current) =>
                                        current.filter(
                                            (item) =>
                                                item.rowKey !== row.rowKey,
                                        ),
                                    )
                                }
                            >
                                <Trash2Icon />
                                <span className="sr-only">Hapus baris</span>
                            </Button>
                        </div>
                        {rowError && <FieldError>{rowError}</FieldError>}
                    </div>
                );
            })}

            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="self-start"
                disabled={rows.length >= maxRows}
                onClick={() =>
                    setRows((current) => [
                        ...current,
                        {
                            values: Object.fromEntries(
                                fields.map((field) => [field.key, '']),
                            ),
                            rowKey: nextRowKey++,
                        },
                    ])
                }
            >
                <PlusIcon data-icon="inline-start" />
                {addLabel}
            </Button>
        </FieldGroup>
    );
}
