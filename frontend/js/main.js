document.addEventListener('DOMContentLoaded', () => {
    const viewCounterElement = document.getElementById('view-counter');

    if (viewCounterElement) {
        const getViews = async () => {
            try {
                const response = await fetch('/api/update-views');
                
                if (!response.ok) {
                    throw new Error('Sunucudan veri alınamadı!');
                }

                const data = await response.json();
                
                viewCounterElement.textContent = data.views;

            } catch (error) {
                console.error('Bir hata oluştu:', error);
                viewCounterElement.textContent = '??'; // Ekranda da ?? işareti gösteriyoruz
            }
        };
    
        getViews();
    }
});