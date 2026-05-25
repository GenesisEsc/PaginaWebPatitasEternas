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
  public cartService = inject(CartService);

  readonly fechaActual  = new Date();
  readonly numeroPedido = Math.floor(Math.random() * 90000) + 10000;

  get itemsPedido(): CartItem[] {
    const pedido = this.cartService.ultimoPedido();
    return pedido ? pedido.items : [];
  }

  get totalPedido(): number {
    const pedido = this.cartService.ultimoPedido();
    return pedido ? pedido.total : 0;
  }

  // --- CAPTURA DINÁMICA DE LOS DATOS DEL FORMULARIO DE CHECKOUT ---
  get clienteData() {
    try {
      // Busca en las claves de almacenamiento donde el checkout guarda la info del cliente
      const seguroCliente = localStorage.getItem('cliente') || localStorage.getItem('datos_entrega') || localStorage.getItem('pedido');
      if (seguroCliente) {
        const data = JSON.parse(seguroCliente);
        return {
          nombre: `${data.nombre || ''} ${data.apellidos || data.apellido || ''}`.trim() || 'Consumidor Final',
          identificacion: data.cedula || data.ruc || data.identificacion || '',
          telefono: data.telefono || ''
        };
      }
    } catch (e) {}
    return { nombre: 'Consumidor Final', identificacion: '', telefono: '' };
  }

  imprimirRecibo(): void {
    const items = this.itemsPedido;
    const total = this.totalPedido;
    const cliente = this.clienteData;

    const fechaFormateada = this.fechaActual.toLocaleDateString('es-EC', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const doc = new jsPDF();
    const logo = new Image();
    logo.src = 'assets/logo.png'; 

    const generarPdf = (incluirLogo: boolean) => {
      // 1. Fondo crema sutil
      doc.setFillColor(253, 251, 247); 
      doc.rect(0, 0, 210, 297, 'F');

      // 2. Doble marco lineal estilo boutique
      doc.setDrawColor(215, 205, 190); 
      doc.setLineWidth(0.4);
      doc.rect(10, 10, 190, 277); 
      doc.setLineWidth(0.15);
      doc.rect(12, 12, 186, 273); 

      let headerY = 32;

      if (incluirLogo) {
        doc.addImage(logo, 'PNG', 92, 20, 26, 26);
        headerY = 56;
      }

      // 3. Encabezado institucional
      doc.setTextColor(12, 35, 64); 
      doc.setFont('times', 'bold');
      doc.setFontSize(26);
      doc.text('PATITAS ETERNAS', 105, headerY, { align: 'center' });

      doc.setFont('times', 'italic');
      doc.setFontSize(11.5);
      doc.setTextColor(140, 120, 100);
      doc.text('Un homenaje de amor que durará para siempre', 105, headerY + 7, { align: 'center' });

      doc.setDrawColor(242, 101, 34); 
      doc.setLineWidth(0.5);
      doc.line(85, headerY + 13, 125, headerY + 13); 

      // 4. Caja de Datos Informativos con redimensionamiento dinámico
      const infoY = headerY + 28;
      
      let altoCaja = 22;
      if (cliente.identificacion || cliente.telefono) altoCaja = 28; // Si hay más datos, agrandamos la tarjeta de fondo

      doc.setFillColor(246, 243, 237);
      doc.roundedRect(20, infoY - 6, 170, altoCaja, 2, 2, 'F');

      doc.setTextColor(60, 60, 60);
      doc.setFont('times', 'bold');
      doc.setFontSize(10.5);
      doc.text(`Comprobante de Pedido: #${this.numeroPedido}`, 24, infoY + 1);
      
      doc.setFont('times', 'normal');
      doc.text(`Fecha de Emisión: ${fechaFormateada}`, 24, infoY + 7);
      doc.text(`Cliente: ${cliente.nombre}`, 24, infoY + 13);
      
      let desplazamientoTabla = 26;
      if (cliente.identificacion || cliente.telefono) {
        let lineaExtra = '';
        if (cliente.identificacion) lineaExtra += `Cédula/RUC: ${cliente.identificacion}   `;
        if (cliente.telefono) lineaExtra += `Teléfono: ${cliente.telefono}`;
        doc.text(lineaExtra.trim(), 24, infoY + 19);
        desplazamientoTabla = 32; // Empujamos la tabla hacia abajo para que nada se solape
      }

      const filas = items.map(item => [
        item.nombre,
        item.cantidad.toString(),
        `$${Number(item.precio).toFixed(2)}`,
        `$${(item.precio * item.cantidad).toFixed(2)}`
      ]);

      // 5. Estructura de la Tabla Boutique
      autoTable(doc, {
        startY: infoY + desplazamientoTabla,
        margin: { left: 20, right: 20 },
        head: [['Concepto / Detalles de Personalización', 'Cant.', 'Precio Unit.', 'Subtotal']],
        body: filas,
        theme: 'plain', 
        headStyles: {
          font: 'times',
          fontStyle: 'bold',
          textColor: [12, 35, 64],
          fontSize: 11,
          halign: 'center',
          cellPadding: { top: 6, bottom: 6 }
        },
        bodyStyles: {
          font: 'times',
          textColor: [70, 70, 70],
          fontSize: 10,
          halign: 'center',
          cellPadding: { top: 7, bottom: 7 }
        },
        columnStyles: {
          0: { halign: 'left' } 
        },
        didDrawCell: (data) => {
          if (data.section === 'head') {
            doc.setDrawColor(242, 101, 34); 
            doc.setLineWidth(0.6);
            doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
          } else if (data.section === 'body') {
            doc.setDrawColor(225, 220, 210); 
            doc.setLineWidth(0.2);
            doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
          }
        }
      });

      // 6. Tarjeta Flotante del Total
      const finalY = (doc as any).lastAutoTable.finalY + 12;
      
      doc.setFillColor(246, 243, 237);
      doc.roundedRect(120, finalY, 70, 15, 2, 2, 'F');

      doc.setFont('times', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text('Monto Total Neto:', 125, finalY + 9.5);

      doc.setFont('times', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(242, 101, 34); 
      doc.text(`$${Number(total).toFixed(2)}`, 185, finalY + 9.5, { align: 'right' });

      // 7. Cierre
      doc.setFont('times', 'italic');
      doc.setFontSize(10.5);
      doc.setTextColor(140, 130, 120);
      doc.text('Gracias por permitirnos preservar de forma eterna los recuerdos de quienes amamos.', 105, 260, { align: 'center' });
      
      doc.setDrawColor(215, 205, 190);
      doc.setLineWidth(0.4);
      doc.line(80, 266, 130, 266);

      doc.setFont('times', 'bold');
      doc.setTextColor(12, 35, 64);
      doc.setFontSize(9);
      doc.text('WWW.PATITASETERNAS.COM', 105, 273, { align: 'center' });

      doc.save(`Recibo_PatitasEternas_${this.numeroPedido}.pdf`);
    };

    logo.onload = () => generarPdf(true);
    logo.onerror = () => generarPdf(false);
  }
}