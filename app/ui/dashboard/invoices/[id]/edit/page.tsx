import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import { Odibee_Sans } from 'next/font/google';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit',
}

export default async function Page(
    { params }:
        { params: { id: string } }
) {
    const id = params.id;
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ])
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/ui/dashboard/invoices' },
                    {
                        label: 'Edit Invoice',
                        href: `/ui/dashboard/invoices/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form invoice={invoice} customers={customers} />
        </main>
    );
}