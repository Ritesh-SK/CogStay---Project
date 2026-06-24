/* ==========================================
   CogStay Manager Portal Javascript Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initChartFilters();
});

// 1. Chart filter tabs in manager occupancy/revenue screens
function initChartFilters() {
    const filterTabs = document.querySelectorAll('.chart-filter-tab');
    if (filterTabs.length) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                filterTabs.forEach(t => t.classList.remove('active-tab'));
                tab.classList.add('active-tab');
                
                const timePeriod = tab.getAttribute('data-period');
                showToast('Updating Chart', `Refreshing statistics for time period: ${timePeriod}`, 'info');
                
                // Simulate chart updating by slightly modifying heights
                const bars = document.querySelectorAll('.chart-bar');
                bars.forEach(bar => {
                    const originalHeight = parseFloat(bar.style.height);
                    // Add some random variation
                    const variation = (Math.random() - 0.5) * 20; // +/- 10%
                    const newHeight = Math.max(10, Math.min(100, originalHeight + variation));
                    bar.style.height = newHeight + '%';
                    
                    // Update label if present
                    const label = bar.querySelector('.chart-bar-val');
                    if (label) {
                        const originalVal = parseFloat(label.innerText.replace(/[^0-9]/g, ''));
                        const newVal = Math.round(originalVal * (newHeight / originalHeight));
                        label.innerText = label.innerText.startsWith('$') ? '$' + newVal : newVal + '%';
                    }
                });
            });
        });
    }
}
