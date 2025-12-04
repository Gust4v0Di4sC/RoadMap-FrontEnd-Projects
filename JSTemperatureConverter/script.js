document.addEventListener('DOMContentLoaded', () => {
	const tempInput = document.getElementById('input-temperature');
	const fromSelect = document.getElementById('from-unit');
	const toSelect = document.getElementById('to-unit');
	const convertBtn = document.getElementById('convert');
	const form = document.getElementById('form-inputs');

	if (!convertBtn) return;

	// garante que o botão não submeta o form
	convertBtn.type = 'button';

	// cria elemento de resultado dentro de .container, fora do form
	let resultEl = document.getElementById('result');
	if (!resultEl) {
		resultEl = document.createElement('div');
		resultEl.id = 'result';
		resultEl.style.marginTop = '12px';
		const container = form && form.closest('.container');
		if (container && form) container.insertBefore(resultEl, form.nextSibling);
		else if (container) container.appendChild(resultEl);
		else document.body.appendChild(resultEl);
	}

	function toCelsius(value, unit) {
		unit = (unit || '').toLowerCase();
		if (unit === 'c') return value;
		if (unit === 'f') return (value - 32) * 5 / 9;
		if (unit === 'k') return value - 273.15;
		return NaN;
	}

	function fromCelsius(c, unit) {
		unit = (unit || '').toLowerCase();
		if (unit === 'c') return c;
		if (unit === 'f') return (c * 9 / 5) + 32;
		if (unit === 'k') return c + 273.15;
		return NaN;
	}

	function fmt(n) {
		if (!isFinite(n)) return '—';
		return (Math.round(n * 100) / 100).toFixed(2);
	}

	function showResult(text, isError = false) {
		resultEl.textContent = text;
		resultEl.style.color = isError ? 'crimson' : '#006400';
	}

	function allFilled() {
		const tempFilled = tempInput && tempInput.value.toString().trim() !== '';
		const fromFilled = fromSelect && fromSelect.value.toString().trim() !== '';
		const toFilled = toSelect && toSelect.value.toString().trim() !== '';
		return Boolean(tempFilled && fromFilled && toFilled);
	}

	function updateButtonState() {
		convertBtn.disabled = !allFilled();
	}

	function convertTemperature() {
		if (!tempInput) { showResult('Campo de temperatura não encontrado.', true); return; }
		const raw = tempInput.value.toString().replace(',', '.').trim();
		const value = parseFloat(raw);
		if (Number.isNaN(value)) { showResult('Insira um número válido.', true); return; }

		const from = fromSelect ? fromSelect.value : '';
		const to = toSelect ? toSelect.value : '';
		if (!from || !to) { showResult('Selecione as unidades.', true); return; }

		if (from === to) {
			showResult(`${fmt(value)} ${from.toUpperCase()} → ${fmt(value)} ${to.toUpperCase()}`);
			return;
		}

		const c = toCelsius(value, from);
		const result = fromCelsius(c, to);
		if (!isFinite(result)) { showResult('Conversão não suportada.', true); return; }

		showResult(`${fmt(value)} ${from.toUpperCase()} → ${fmt(result)} ${to.toUpperCase()}`);
	}


	// listeners
	if (tempInput) tempInput.addEventListener('input', updateButtonState);
	if (fromSelect) fromSelect.addEventListener('change', updateButtonState);
	if (toSelect) toSelect.addEventListener('change', updateButtonState);
	convertBtn.addEventListener('click', (e) => { e.preventDefault(); if (!convertBtn.disabled) convertTemperature(); });

	if (tempInput) tempInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (!convertBtn.disabled) convertTemperature();
		}
	});

	// inicializa
	updateButtonState();
});
