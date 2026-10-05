/**
 * SOLAR SETE - INTERATIVIDADE & CALCULADORA SOLAR
 * Responsivo, fluido e integrado ao WhatsApp Comercial
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. MENU MOBILE
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 2. NAVBAR SCROLL EFFECT
  const mainHeader = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader.classList.add('bg-[#0b0f17]/95', 'shadow-lg', 'border-b', 'border-slate-800/80');
      mainHeader.classList.remove('bg-[#0b0f17]/80');
    } else {
      mainHeader.classList.remove('shadow-lg', 'border-slate-800/80');
      mainHeader.classList.add('bg-[#0b0f17]/80');
    }
  });

  // 3. MÁSCARA E CÁLCULO DA SIMULAÇÃO SOLAR
  const inputFatura = document.getElementById('inputFatura');
  const inputNome = document.getElementById('inputNome');
  const inputWhatsapp = document.getElementById('inputWhatsapp');
  const btnCalcular = document.getElementById('btnCalcular');
  const previewEconomia = document.getElementById('previewEconomia');
  const economiaMesSpan = document.getElementById('economiaMes');
  const economiaAnoSpan = document.getElementById('economiaAno');
  const economia25AnosSpan = document.getElementById('economia25Anos');

  // Máscara para moeda brasileira (R$)
  function formatCurrency(value) {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const floatVal = parseFloat(numbers) / 100;
    return floatVal.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  // Máscara para telefone/WhatsApp (XX) XXXXX-XXXX
  function formatPhone(value) {
    let numbers = value.replace(/\D/g, '');
    if (numbers.length > 11) numbers = numbers.slice(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }

  if (inputWhatsapp) {
    inputWhatsapp.addEventListener('input', (e) => {
      e.target.value = formatPhone(e.target.value);
    });
  }

  function calcularEconomia(valorFloat) {
    if (!valorFloat || valorFloat <= 0) {
      if (previewEconomia) previewEconomia.classList.add('hidden');
      return;
    }

    // Economia padrão de até 95% (descontando custo de disponibilidade da Cemig)
    const taxaDisponibilidade = Math.min(valorFloat * 0.05, 50); // Mínimo residual da concessionária
    const economiaMensal = Math.max(valorFloat * 0.95, valorFloat - taxaDisponibilidade);
    const economiaAnual = economiaMensal * 12;
    const economia25Anos = economiaAnual * 25;

    if (economiaMesSpan) {
      economiaMesSpan.textContent = economiaMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    if (economiaAnoSpan) {
      economiaAnoSpan.textContent = economiaAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    if (economia25AnosSpan) {
      economia25AnosSpan.textContent = economia25Anos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    if (previewEconomia) {
      previewEconomia.classList.remove('hidden');
    }
  }

  if (inputFatura) {
    inputFatura.addEventListener('input', (e) => {
      const formatted = formatCurrency(e.target.value);
      e.target.value = formatted;

      const rawNumbers = formatted.replace(/\D/g, '');
      const num = rawNumbers ? parseFloat(rawNumbers) / 100 : 0;
      calcularEconomia(num);
    });
  }

  // Redirecionamento para o WhatsApp Oficial
  if (btnCalcular) {
    btnCalcular.addEventListener('click', (e) => {
      e.preventDefault();

      const nome = inputNome ? inputNome.value.trim() : '';
      const whatsapp = inputWhatsapp ? inputWhatsapp.value.trim() : '';
      const fatura = inputFatura ? inputFatura.value.trim() : '';

      let msg = 'Olá, Solar Sete! Gostaria de uma simulação de energia solar para o meu imóvel.';

      if (nome) {
        msg = `Olá, Solar Sete! Meu nome é *${nome}*.`;
      }
      if (fatura) {
        msg += ` Minha conta de luz média atual é de *${fatura}* por mês.`;
      }
      if (whatsapp) {
        msg += ` Meu contato é ${whatsapp}.`;
      }
      msg += ` Gostaria de saber como zerar até 95% dessa fatura com engenharia própria em Sete Lagoas e região!`;

      const encoded = encodeURIComponent(msg);
      const url = `https://wa.me/5531996728374?text=${encoded}`;
      window.open(url, '_blank');
    });
  }

  // 4. ANIMAÇÕES SUAVES AO ROLAR (Intersection Observer)
  const animatedElements = document.querySelectorAll('.fade-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-8');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => {
    el.classList.add('transition-all', 'duration-700', 'ease-out', 'opacity-0', 'translate-y-8');
    observer.observe(el);
  });
});
