export default function Header({ onClear }) {
    const currentDate = new Date().toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                    <div className="text-3xl">📅</div>
                    <div>
                        <h1 className="text-3xl font-bold">График отпусков</h1>
                        <p className="text-blue-100 text-sm">Система управления отпусками сотрудников</p>
                    </div>
                </div>

                <div className="text-center md:text-right">
                    <div className="text-sm text-blue-200 mb-1">Текущая дата</div>
                    <div className="text-lg font-semibold mb-2">{currentDate}</div>
                    {onClear && (
                        <button
                            onClick={onClear}
                            className="bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-2 rounded-lg border border-white/20 transition-colors"
                            title="Очистить все сохранённые данные"
                        >
                            Очистить данные
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}