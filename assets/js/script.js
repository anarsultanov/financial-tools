document.addEventListener('DOMContentLoaded', function() {
    setActiveTool('index');

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const toolId = this.getAttribute('href').substring(1);
            setActiveTool(toolId);
            closeMenu();
        });
    });

    addRebalanceEntry(); // Add the first entry field by default
    document.getElementById('rebalanceForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting

        // Your calculation logic here
        calculateRebalance();
    });
});

function setActiveTool(toolId) {
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href').substring(1) === toolId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    showTool(toolId);
}

function showTool(toolId) {
    document.querySelectorAll('.tool').forEach(function(tool) {
        tool.style.display = 'none';
    });

    const selectedTool = document.getElementById(toolId);
    if (selectedTool) {
        selectedTool.style.display = 'block';
    } else {
        console.error("Tool with ID '" + toolId + "' not found.");
    }
}

function toggleMenu() {
    const menu = document.querySelector('.nav-menu');
    menu.classList.toggle('active');
}

function closeMenu() {
    const menu = document.querySelector('.nav-menu');
    if (menu.classList.contains('active')) {
        menu.classList.remove('active'); // Only remove 'active', not toggle
    }
}

const financialAdvices = [
    "When deciding between paying off loans and investing, compare the interest rate of your loan with the expected return on investments. If the investment return rate is higher, investing might be more beneficial in the long run.",
    "Different loans have different impacts on your financial strategy. High-interest loans, like credit cards, generally should be paid off quickly, while low-interest loans, such as mortgages or student loans, provide more flexibility for investing.",
    "Paying off debt guarantees a return equal to the loan's interest rate, risk-free. Consider the opportunity cost of using extra funds to repay debt early instead of investing them for a potentially higher return.",
    "Mortgage interest and some investment gains have tax implications. Understand how taxes affect the real cost of your loan and the net return on your investments to make an informed decision.",
    "Your comfort with risk plays a significant role in deciding between paying off debt and investing. Those with lower risk tolerance may find paying down debt more appealing, while others may prefer the potentially higher returns from investing.",
    "Align your decision with your long-term financial goals. Whether it's becoming debt-free or building wealth through investments, choose the strategy that best suits your ultimate objectives.",
    "Don't underestimate the psychological peace of mind that comes from reducing debt. For some, the emotional benefit of being debt-free is more valuable than the financial gains from investing.",
    "Investing instead of paying off low-interest loans can be financially advantageous, but ensure you maintain sufficient liquidity for emergencies.",
    "Consider how your decision affects your future financial flexibility. Reducing debt now can increase your ability to invest more aggressively later.",
    "As you make progress towards your debt or investment goals, regularly rebalance your strategy to reflect changes in your financial situation, interest rates, and investment opportunities."
];

function calculate() {
    // Extract values from inputs or use placeholders as defaults
    const loanAmount = parseFloat(document.getElementById('loanAmount').value || document.getElementById('loanAmount').placeholder);
    const interestRate = parseFloat(document.getElementById('interestRate').value || document.getElementById('interestRate').placeholder) / 100 / 12;
    const investmentRate = parseFloat(document.getElementById('investmentRate').value || document.getElementById('investmentRate').placeholder) / 100 / 12;
    const amortizationS1 = parseFloat(document.getElementById('amortizationS1').value || document.getElementById('amortizationS1').placeholder);
    const investmentS1 = parseFloat(document.getElementById('investmentS1').value || document.getElementById('investmentS1').placeholder);
    const amortizationS2 = parseFloat(document.getElementById('amortizationS2').value || document.getElementById('amortizationS2').placeholder);
    const investmentS2 = parseFloat(document.getElementById('investmentS2').value || document.getElementById('investmentS2').placeholder);
    const periodMonths = parseFloat(document.getElementById('period').value || document.getElementById('period').placeholder) * 12;

    const resultsS1 = calculateLoanAndInvestment(loanAmount, interestRate, amortizationS1, investmentRate, investmentS1, periodMonths);
    const resultsS2 = calculateLoanAndInvestment(loanAmount, interestRate, amortizationS2, investmentRate, investmentS2, periodMonths);

    const amountAmortizedS1 = loanAmount - resultsS1.remainingLoan;
    const amountAmortizedS2 = loanAmount - resultsS2.remainingLoan;

    const netFinancialBenefitS1 = (amountAmortizedS1 + resultsS1.investmentValue) - resultsS1.totalInterestPaid;
    const netFinancialBenefitS2 = (amountAmortizedS2 + resultsS2.investmentValue) - resultsS2.totalInterestPaid;

    const adviceIndex = Math.floor(Math.random() * financialAdvices.length);
    const selectedAdvice = financialAdvices[adviceIndex];

    document.getElementById('results').innerHTML = `
        <div class="results-container">
            <h4 class="scenario-headline">Scenario 1: Amortizing ${amortizationS1.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}/month and Investing ${investmentS1.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}/month</h4>
            <div class="result-item">Remaining Loan: <span>${resultsS1.remainingLoan.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
            <div class="result-item">Amount Amortized: <span class='positive'>${amountAmortizedS1.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
            <div class="result-item">Investment Value: <span class='positive'>${resultsS1.investmentValue.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
            <div class="result-item">Total Interest Paid: <span class='negative'>${resultsS1.totalInterestPaid.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
            <div class="result-item"><strong>Net Financial Benefit: </strong><span class='positive'><strong>${netFinancialBenefitS1.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></span></div>
            
            <h4 class="scenario-headline">Scenario 2: Amortizing ${amortizationS2.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}/month and Investing ${investmentS2.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}/month</h4>
            <div class="result-item">Remaining Loan: <span>${resultsS2.remainingLoan.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
            <div class="result-item">Amount Amortized: <span class='positive'>${amountAmortizedS2.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
            <div class="result-item">Investment Value: <span class='positive'>${resultsS2.investmentValue.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
            <div class="result-item">Total Interest Paid: <span class='negative'>${resultsS2.totalInterestPaid.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
            <div class="result-item"><strong>Net Financial Benefit: </strong><span class='positive'><strong>${netFinancialBenefitS2.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></span></div>
        
            <div class="financial-advice">
                <h3>Quick Tip</h3>
                <p>${selectedAdvice}</p>
            </div>
        </div>
    `;
}

function calculateLoanAndInvestment(loanAmount, monthlyInterestRate, monthlyAmortization, investmentRate, monthlyInvestment, periodMonths) {
    let remainingLoan = loanAmount;
    let totalInterestPaid = 0;
    let investmentValue = 0;

    for (let month = 1; month <= periodMonths; month++) {
        const interestPayment = remainingLoan * monthlyInterestRate;
        totalInterestPaid += interestPayment;

        const actualAmortization = Math.min(remainingLoan, monthlyAmortization);
        remainingLoan -= actualAmortization
        investmentValue = (investmentValue + monthlyAmortization - actualAmortization + monthlyInvestment) * (1 + investmentRate);
    }

    return {
        remainingLoan,
        totalInterestPaid,
        investmentValue
    };
}

function addRebalanceEntry() {
    const container = document.getElementById('rebalanceEntries');
    const entryDiv = document.createElement('div');
    entryDiv.className = 'rebalance-entry';
    entryDiv.innerHTML = `
        <input type="text" class="fund-name" placeholder="Asset Name" required style="flex: 2;">
        <input type="number" class="current-allocation" placeholder="Allocation" min="0" required style="flex: 1;">
        <input type="number" class="target-percentage" placeholder="Target (%)" min="0" max="100" required style="flex: 1;">
        <button class="remove-entry" onclick="removeEntry(this)">×</button>
    `;
    container.appendChild(entryDiv);
}

function removeEntry(button) {
    button.parentElement.remove();
}

function calculateRebalance() {
    event.preventDefault(); // Prevent the form from submitting

    const entries = document.querySelectorAll('#rebalanceEntries .rebalance-entry');
    for (let entry of entries) {
        const inputs = entry.querySelectorAll('input');
        for (let input of inputs) {
            if (!input.value) {
                alert('Please fill in all fields before calculating.');
                return;
            }
        }
    }

    let totalCurrentAllocation = 0;
    let adjustments = [];

    entries.forEach(entry => {
        const currentAllocation = parseFloat(entry.querySelector('.current-allocation').value || 0);
        totalCurrentAllocation += currentAllocation;
    });

    if (totalCurrentAllocation === 0) {
        alert('Please enter current allocations.');
        return;
    }

    let totalTargetPercentage = 0;

    entries.forEach(entry => {
        const name = entry.querySelector('.fund-name').value;
        const currentAllocation = parseFloat(entry.querySelector('.current-allocation').value || 0);
        const targetPercentage = parseFloat(entry.querySelector('.target-percentage').value || 0);
        totalTargetPercentage += targetPercentage;

        const targetAllocation = (totalCurrentAllocation * targetPercentage) / 100;
        const adjustment = targetAllocation - currentAllocation;

        adjustments.push({ name, adjustment });
    });

    if (totalTargetPercentage !== 100) {
        alert('Total target allocation percentages must sum to 100.');
        return;
    }

    displayRebalanceResults(adjustments);
}

function displayRebalanceResults(adjustments) {
    const resultsDiv = document.getElementById('rebalanceResults');
    resultsDiv.innerHTML = ''; // Clear previous results

    let adjustmentsNeeded = false;

    adjustments.forEach(adj => {
        if (Math.abs(adj.adjustment) >= 0.01) { // Assuming 0.01 as a minimal threshold for adjustments
            adjustmentsNeeded = true;
            const resultItem = document.createElement('div');
            resultItem.classList.add('rebalance-result-item', adj.adjustment > 0 ? 'add' : 'remove');
            const adjustmentText = `${adj.adjustment > 0 ? 'Add' : 'Remove'} ${Math.abs(adj.adjustment).toFixed(2)}`;
            resultItem.innerHTML = `<strong>${adj.name}</strong> ${adjustmentText}`;
            resultsDiv.appendChild(resultItem);
        }
    });

    // Display a message if no significant adjustments are needed
    if (!adjustmentsNeeded) {
        const noChangeMessage = document.createElement('div');
        noChangeMessage.classList.add('no-change');
        noChangeMessage.innerHTML = "Your portfolio is already balanced according to your target allocations. No adjustments needed at this time.";
        resultsDiv.appendChild(noChangeMessage);
    }

    displayTip()
}

const rebalancingTips = [
    "Consider rebalancing your portfolio periodically, typically once a year, to maintain your desired risk level.",
    "Be mindful of tax implications when selling investments to rebalance your portfolio. Selling assets that have appreciated in value could result in capital gains taxes.",
    "Transaction costs can add up. Try to rebalance using cash flows (like dividends or new contributions) to minimize costs.",
    "Market conditions change, and so do your financial goals. Regularly review your target allocations to ensure they still align with your objectives.",
    "Use threshold rebalancing instead of calendar-based rebalancing to respond to significant market movements and maintain your portfolio's risk profile.",
    "Consider the emotional aspect of investing; rebalancing helps remove emotion from the decision-making process, keeping you aligned with long-term objectives.",
    "Diversification is key. Ensure your portfolio includes a variety of asset classes to spread risk and increase the potential for return.",
    "Look into tax-advantaged accounts for rebalancing activities to potentially reduce tax liabilities associated with buying and selling assets.",
    "Automate your rebalancing strategy where possible. Many investment platforms offer automatic rebalancing features to keep your portfolio aligned with your goals.",
    "Rebalancing is not just about selling off; it's also an opportunity to buy undervalued assets that fit your long-term investment strategy.",
    "Keep an emergency fund and do not rebalance using these funds. Your investment portfolio should be separate from your short-term financial safety net.",
    "Remember, rebalancing may lead to realizing taxable gains. Always consult with a tax advisor to understand the implications before making significant changes."
];

function displayTip() {
    const tipIndex = Math.floor(Math.random() * rebalancingTips.length);
    const tip = rebalancingTips[tipIndex];
    const tipElement = document.createElement('div');
    tipElement.classList.add('financial-advice');
    tipElement.innerHTML = `<h3>Tip for Smart Rebalancing</h3><p>${tip}</p>`;
    document.getElementById('rebalanceResults').appendChild(tipElement);
}
