import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";
import { Printer } from "lucide-react";

const naira = (v: string | number) =>
  "₦" + Number(v || 0).toLocaleString("en-NG", { maximumFractionDigits: 2 });

type Item = { serviceName: string; quantity: number | null; totalPrice: string };

export default function ReceiptDialog({
  bookingId,
  children,
}: {
  bookingId: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { data: booking, isLoading } = trpc.booking.getById.useQuery(
    { id: bookingId },
    { enabled: open }
  );

  const ref = `WC-${String(bookingId).padStart(5, "0")}`;
  const date = booking?.createdAt ? new Date(booking.createdAt).toLocaleString() : "";

  function printReceipt() {
    if (!booking) return;
    const items = (booking.items as Item[]) ?? [];
    const rows = items
      .map(
        (it) =>
          `<tr><td>${it.serviceName} ×${it.quantity ?? 1}</td><td style="text-align:right">${naira(
            it.totalPrice
          )}</td></tr>`
      )
      .join("");
    const win = window.open("", "_blank", "width=480,height=720");
    if (!win) return;
    win.document.write(`
      <html><head><title>Receipt ${ref}</title>
      <style>
        body{font-family:ui-sans-serif,system-ui,sans-serif;color:#15110d;padding:28px;max-width:420px;margin:auto}
        h1{font-size:22px;margin:0}
        .muted{color:#6b6b6b;font-size:12px}
        table{width:100%;border-collapse:collapse;margin:16px 0}
        td{padding:6px 0;font-size:14px}
        .tot td{border-top:2px solid #15110d;font-weight:700;padding-top:10px}
        .row{display:flex;justify-content:space-between;font-size:14px;padding:3px 0}
        hr{border:none;border-top:1px dashed #ccc;margin:14px 0}
      </style></head><body>
        <h1>WeClean</h1>
        <p class="muted">Payment receipt · ${ref}</p>
        <hr/>
        <div class="row"><span class="muted">Date</span><span>${date}</span></div>
        <div class="row"><span class="muted">Status</span><span>${booking.status}</span></div>
        <div class="row"><span class="muted">Payment</span><span>${booking.paymentStatus}</span></div>
        <table>${rows}</table>
        <div class="row"><span class="muted">Subtotal</span><span>${naira(booking.subtotal)}</span></div>
        <div class="row"><span class="muted">Add-ons</span><span>${naira(booking.addonTotal ?? "0")}</span></div>
        <div class="row"><span class="muted">Platform fee</span><span>${naira(booking.platformFee ?? "0")}</span></div>
        <table><tr class="tot"><td>Total</td><td style="text-align:right">${naira(booking.totalAmount)}</td></tr></table>
        <hr/>
        <p class="muted">Thank you for choosing WeClean. This is a computer-generated receipt.</p>
      </body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 250);
  }

  const items = (booking?.items as Item[]) ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Receipt · {ref}</DialogTitle>
        </DialogHeader>

        {isLoading || !booking ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <div className="text-sm">
            <div className="flex justify-between text-slate-500 text-xs mb-3">
              <span>{date}</span>
              <span className="capitalize">{booking.status?.replace(/_/g, " ")}</span>
            </div>
            <div className="space-y-1.5 border-y border-ink/10 py-3">
              {items.length ? (
                items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {it.serviceName} <span className="text-slate-400">×{it.quantity ?? 1}</span>
                    </span>
                    <span className="font-medium">{naira(it.totalPrice)}</span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between">
                  <span>Cleaning service</span>
                  <span className="font-medium">{naira(booking.subtotal)}</span>
                </div>
              )}
            </div>
            <div className="space-y-1 py-3 text-slate-600">
              <div className="flex justify-between"><span>Subtotal</span><span>{naira(booking.subtotal)}</span></div>
              <div className="flex justify-between"><span>Add-ons</span><span>{naira(booking.addonTotal ?? "0")}</span></div>
              <div className="flex justify-between"><span>Platform fee</span><span>{naira(booking.platformFee ?? "0")}</span></div>
            </div>
            <div className="flex justify-between border-t-2 border-ink pt-3 font-bold text-base">
              <span>Total</span>
              <span>{naira(booking.totalAmount)}</span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            className="bg-ink hover:bg-brand text-white"
            disabled={!booking}
            onClick={printReceipt}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print / Save PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
