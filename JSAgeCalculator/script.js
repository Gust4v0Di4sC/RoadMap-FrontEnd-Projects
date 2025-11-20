
const DateTime = luxon.DateTime;

const dateInput = document.getElementById('birth-date');
const submitButton = document.getElementById('btn-calc');
const resultCalc = document.getElementById('result-calc');

let datepickerInstance;

const picker = datepickerInstance = datepicker(dateInput, {

        dateSelected: null,
        formatter: (input, date, instance) => {
            input.value = date.toLocaleDateString('pt-BR');
        },
        maxDate: new Date(),
        startDay: 0,
        customDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        customMonths: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
});


function calculateAge(e) {
    e.preventDefault();
    const dataSelecionada = picker.dateSelected;

    if (!dataSelecionada) {
        resultCalc.style.color = 'red';
        resultCalc.innerText = 'Por favor, selecione uma data de nascimento.';
        return;
    }

    const dateBirth = DateTime.fromJSDate(dataSelecionada);
    const dataAtual = DateTime.now();



    const diff = dataAtual.diff(dateBirth, ['years', 'months']).toObject();

    const years = Math.floor(diff.years);
    const months = Math.floor(diff.months);


    resultCalc.style.color = 'black';

    const textYears = years === 1 ? 'ano' : 'anos';
    const textMonths = months === 1 ? 'mês' : 'meses';

    resultCalc.innerHTML = `Você tem <span class="text-age">${years} ${textYears}</span> e <span class="text-age">${months} ${textMonths}</span>.`;
}

submitButton.addEventListener('click', calculateAge);


