import dayjs from 'dayjs';
import { useState } from 'react';

export default function CompanyCalendar({ employees = [] }) {
    const [selectedVacation, setSelectedVacation] = useState(null);
    const [filterType, setFilterType] = useState('all'); // 'all', 'отпуск', 'больничный', 'отгул'

    // Диапазон дат: ближайшие 6 месяцев, начиная с текущего
    const getCalendarRange = () => {
        const start = dayjs().startOf('month');
        return {
            start,
            end: start.add(5, 'month').endOf('month')
        };
    };

    const calendarRange = getCalendarRange();
    const TOTAL_DAYS = calendarRange.end.diff(calendarRange.start, 'day') + 1;
    const months = [];
    {
        let cursor = calendarRange.start.startOf('month');
        while (cursor.isBefore(calendarRange.end) || cursor.isSame(calendarRange.end, 'month')) {
            months.push(cursor);
            cursor = cursor.add(1, 'month');
        }
    }

    // Генерируем уникальный цвет для сотрудника на основе его ID
    const getEmployeeColor = (employeeId) => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
            'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500',
            'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
        ];
        return colors[employeeId % colors.length];
    };

    const getVacationColor = (type, employeeId) => {
        const baseColor = getEmployeeColor(employeeId);
        const hoverColor = baseColor.replace('500', '600');

        switch (type) {
            case 'отпуск':
                return `${baseColor} hover:${hoverColor}`;
            case 'больничный':
                return `${baseColor} hover:${hoverColor}`;
            case 'отгул':
                return `${baseColor} hover:${hoverColor}`;
            default:
                return `${baseColor} hover:${hoverColor}`;
        }
    };

    const getVacationIcon = (type) => {
        switch (type) {
            case 'отпуск':
                return '🏖️';
            case 'больничный':
                return '🏥';
            case 'отгул':
                return '📅';
            default:
                return '📋';
        }
    };

    const getMonthName = (date) => {
        try {
            return date.format('MMMM YYYY');
        } catch (error) {
            // Fallback на английский формат если русский не работает
            return date.format('MMMM YYYY');
        }
    };

    const isWeekend = (date) => {
        return date.day() === 0 || date.day() === 6;
    };

    const getVacationsForDay = (date) => {
        let allVacations = employees.flatMap(emp => {
            return (emp.vacations || []).filter(vacation => {
                const start = dayjs(vacation.startDate);
                const end = dayjs(vacation.endDate);
                return date.isSame(start) || date.isSame(end) || (date.isAfter(start) && date.isBefore(end));
            }).map(vacation => ({
                ...vacation,
                employeeName: emp.name,
                employeePosition: emp.position,
                employeeId: emp.id
            }));
        });

        // Применяем фильтр по типу
        if (filterType !== 'all') {
            allVacations = allVacations.filter(v => v.type === filterType);
        }

        return allVacations;
    };

    // days список больше не нужен; формируем дни для каждого месяца отдельно

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            {/* Заголовок */}
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    🏢 Общий календарь отпусков компании
                </h2>
                <p className="text-gray-600">
                    Просмотр всех отпусков, больничных и отгулов сотрудников
                </p>
            </div>

            {/* Легенда цветов сотрудников */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">🎨 Цвета сотрудников:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {employees.map(emp => (
                        <div key={emp.id} className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded ${getEmployeeColor(emp.id)}`}></div>
                            <span className="text-sm text-gray-700 truncate">{emp.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Фильтры */}
            <div className="mb-6 flex justify-center">
                <div className="bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterType === 'all'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Все типы
                    </button>
                    <button
                        onClick={() => setFilterType('отпуск')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterType === 'отпуск'
                            ? 'bg-white text-green-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        🏖️ Отпуска
                    </button>
                    <button
                        onClick={() => setFilterType('больничный')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterType === 'больничный'
                            ? 'bg-white text-red-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        🏥 Больничные
                    </button>
                    <button
                        onClick={() => setFilterType('отгул')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterType === 'отгул'
                            ? 'bg-white text-yellow-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        📅 Отгулы
                    </button>
                </div>
            </div>

            {/* Календарная сетка: 6 месяцев, каждый месяц отделён и подписан */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {months.map((monthStart) => {
                    const start = monthStart.startOf('month');
                    const end = monthStart.endOf('month');
                    const total = end.diff(start, 'day') + 1;
                    const daysOfMonth = Array.from({ length: total }, (_, i) => start.add(i, 'day'));
                    return (
                        <div key={`month-${monthStart.format('YYYY-MM')}`} className="border-t first:border-t-0 border-gray-200">
                            {/* Заголовок месяца */}
                            <div className="bg-purple-50 p-3 text-center">
                                <div className="font-bold text-purple-600 text-lg">{getMonthName(monthStart)}</div>
                            </div>
                            {/* Дни недели */}
                            <div className="grid grid-cols-7 gap-px bg-gray-200">
                                {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map(weekday => (
                                    <div key={`w-${monthStart.format('YYYY-MM')}-${weekday}`} className="bg-gray-100 p-2 text-center text-xs font-medium text-gray-600">{weekday}</div>
                                ))}
                            </div>
                            {/* Сетка дней */}
                            <div className="grid grid-cols-7 gap-px bg-gray-200">
                                {daysOfMonth.map((day) => {
                                    const dayVacations = getVacationsForDay(day);
                                    const isCurrentDay = day.isSame(dayjs(), 'day');
                                    return (
                                        <div key={`d-${day.format('YYYY-MM-DD')}`} className={`min-h-[120px] bg-white p-1 relative ${isWeekend(day) ? 'bg-gray-50' : ''} ${isCurrentDay ? 'ring-2 ring-purple-400' : ''}`}>
                                            <div className={`text-xs font-medium mb-1 ${isCurrentDay ? 'text-purple-600 font-bold' : isWeekend(day) ? 'text-red-500' : 'text-gray-700'}`}>{day.date()}</div>
                                            {dayVacations.map((vacation) => {
                                                const isStart = day.isSame(dayjs(vacation.startDate), 'day');
                                                const isEnd = day.isSame(dayjs(vacation.endDate), 'day');
                                                const isMiddle = !isStart && !isEnd;
                                                return (
                                                    <div
                                                        key={`${vacation.id}-${day.format('YYYY-MM-DD')}`}
                                                        className={`mb-1 p-1 rounded text-xs text-white cursor-pointer transition-all duration-200 ${getVacationColor(vacation.type, vacation.employeeId)} ${isStart ? 'rounded-l-md' : ''} ${isEnd ? 'rounded-r-md' : ''} ${isMiddle ? 'rounded-none' : ''}`}
                                                        onClick={() => setSelectedVacation(vacation)}
                                                        title={`${vacation.employeeName} - ${vacation.type}: ${dayjs(vacation.startDate).format('DD.MM.YYYY')} - ${dayjs(vacation.endDate).format('DD.MM.YYYY')}`}
                                                    >
                                                        <div className="flex items-center space-x-1">
                                                            <span className="text-xs">{getVacationIcon(vacation.type)}</span>
                                                            {isStart && (
                                                                <span className="font-medium truncate text-xs">{vacation.employeeName}</span>
                                                            )}
                                                        </div>
                                                        {isStart && (<div className="text-xs opacity-75">{vacation.type}</div>)}
                                                        {isEnd && (<div className="text-xs opacity-75">Конец</div>)}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Детальная информация об отпуске */}
            {selectedVacation && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-purple-800 flex items-center">
                            {getVacationIcon(selectedVacation.type)} {selectedVacation.type}
                            <span className="ml-2 text-sm text-purple-600">
                                - {selectedVacation.employeeName}
                            </span>
                        </h4>
                        <button
                            onClick={() => setSelectedVacation(null)}
                            className="text-purple-600 hover:text-purple-800 text-xl"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <div className="text-sm font-medium text-gray-600">Сотрудник:</div>
                            <div className="text-lg font-semibold text-gray-800">
                                {selectedVacation.employeeName} ({selectedVacation.employeePosition})
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-600">Тип:</div>
                            <div className="text-lg font-semibold text-gray-800">
                                {selectedVacation.type}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-600">Дата начала:</div>
                            <div className="text-lg font-semibold text-gray-800">
                                {dayjs(selectedVacation.startDate).format('DD.MM.YYYY (dddd)')}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-600">Дата окончания:</div>
                            <div className="text-lg font-semibold text-gray-800">
                                {dayjs(selectedVacation.endDate).format('DD.MM.YYYY (dddd)')}
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="text-sm font-medium text-gray-600">Продолжительность:</div>
                        <div className="text-lg font-semibold text-gray-800">
                            {dayjs(selectedVacation.endDate).diff(dayjs(selectedVacation.startDate), 'day') + 1} дней
                        </div>
                    </div>
                </div>
            )}

            {/* Блок общей статистики удалён по требованию */}
        </div>
    );
}
