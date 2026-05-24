import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CartService, CartItem } from '../../../core/services/cart';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [RouterLink, CommonModule, DatePipe],
  templateUrl: './confirmacion.html',
  styleUrl: './confirmacion.css'
})
export class ConfirmacionComponent {
  private cartService = inject(CartService);

  readonly fechaActual  = new Date();
  readonly numeroPedido = Math.floor(Math.random() * 90000) + 10000;

  imprimirRecibo(): void {
    const pedido = this.cartService.ultimoPedido();
    const items: CartItem[] = pedido?.items ?? [];
    const total: number = pedido?.total ?? 0;

    const fechaFormateada = this.fechaActual.toLocaleDateString('es-EC', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const doc = new jsPDF();
    const logo = new Image();
    logo.src = 'assets/logo-tuti.png';
    logo.onload = () => {
      doc.addImage(logo, 'PNG', 14, 10, 45, 20);

      // ── Encabezado ────────────────────────────────────────────────────
      doc.setFontSize(20);
      doc.setTextColor(0, 61, 165);
      doc.setFont('helvetica', 'bold');
      doc.text('Recibo de Compra', 105, 20, { align: 'center' });

      doc.setDrawColor(242, 101, 34);
      doc.setLineWidth(0.8);
      doc.line(14, 35, 196, 35);

      // ── Datos del pedido ──────────────────────────────────────────────
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'normal');

      doc.text('Número de pedido:', 14, 45);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 61, 165);
      doc.text(`#${this.numeroPedido}`, 70, 45);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text('Fecha:', 14, 53);
      doc.setFont('helvetica', 'bold');
      doc.text(fechaFormateada, 70, 53);

      doc.setFont('helvetica', 'normal');
      doc.text('Estado:', 14, 61);
      doc.setTextColor(40, 167, 69);
      doc.setFont('helvetica', 'bold');
      doc.text('Confirmado ✓', 70, 61);

      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(14, 68, 196, 68);

      // ── Tabla con productos ────────────────────────────────────
      const filas = items.map(item => [
  item.nombre,
  item.cantidad.toString(),
  `$${Number(item.precio).toFixed(2)}`,
  `$${(Number(item.precio) * item.cantidad).toFixed(2)}`
]);

      autoTable(doc, {
        startY: 73,
        head: [['Producto', 'Cantidad', 'Precio Unit.', 'Subtotal']],
        body: filas,
        headStyles: {
          fillColor: [0, 61, 165],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          textColor: [50, 50, 50],
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [238, 244, 255]
        },
        styles: {
          font: 'helvetica',
          fontSize: 10,
          cellPadding: 4
        }
      });

      // ── Total ─────────────────────────────────────────────────────────
      const finalY = (doc as any).lastAutoTable.finalY + 8;

      doc.setDrawColor(242, 101, 34);
      doc.setLineWidth(0.5);
      doc.line(120, finalY, 196, finalY);

      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text('TOTAL:', 130, finalY + 8);
      doc.setTextColor(0, 61, 165);
      doc.text(`$${Number(total).toFixed(2)}`, 196, finalY + 8, { align: 'right' });

      // ── Pie de página ─────────────────────────────────────────────────
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(150, 150, 150);
      doc.text('Gracias por comprar en TuTi. Este documento es un comprobante de su pedido.', 105, 285, { align: 'center' });
      doc.text('www.tuti.com.ec', 105, 290, { align: 'center' });

      doc.save(`recibo-tuti-${this.numeroPedido}.pdf`);
    };
  }
}