import dayjs from 'dayjs';
import { useState } from 'react';

export default function VacationTimeline({ employee = { vacations: [] }, onSave, allEmployees = [] }) {
  const [isEditing, setIsEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Диапазон дат для индивидуального сотрудника: показываем полностью все отпуска (с захватом соседних месяцев)
  const vacations = employee.vacations || [];
  const rangeStart = (() => {
    if (vacations.length === 0) return dayjs().startOf('month');
    const minStart = vacations.reduce((acc, v) => {
      const d = dayjs(v.startDate);
      return acc && acc.isBefore(d) ? acc : d;
    }, null) || dayjs();
    return minStart.startOf('month');
  })();
  const rangeEnd = (() => {
    if (vacations.length === 0) return dayjs().endOf('month');
    const maxEnd = vacations.reduce((acc, v) => {
      const d = dayjs(v.endDate);
      return acc && acc.isAfter(d) ? acc : d;
    }, null) || dayjs();
    return maxEnd.endOf('month');
  })();

  const TOTAL_DAYS = rangeEnd.diff(rangeStart, 'day') + 1;

  // Палитра и вспомогательные функции как в общем календаре
  const getEmployeeColor = (employeeId) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500',
      'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
    ];
    return colors[employeeId % colors.length];
  };

  const getVacationColor = (_type, employeeId) => {
    const baseColor = getEmployeeColor(employeeId);
    const hoverColor = baseColor.replace('500', '600');
    return `${baseColor} hover:${hoverColor}`;
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
    } catch (e) {
      return date.format('MMMM YYYY');
    }
  };

  const isWeekend = (date) => date.day() === 0 || date.day() === 6;

  const getVacationsForDay = (date) => {
    return (employee.vacations || []).filter(vacation => {
      const start = dayjs(vacation.startDate);
      const end = dayjs(vacation.endDate);
      return date.isSame(start, 'day') || date.isSame(end, 'day') || (date.isAfter(start, 'day') && date.isBefore(end, 'day'));
    });
  };

  const handleEdit = (vacationId, field) => {
    const vacation = (employee.vacations || []).find(v => v.id === vacationId);
    setIsEditing({ id: vacationId, field });
    setEditValue(vacation ? vacation[field] : '');
  };

  const handleSaveEdit = () => {
    const updatedEmployees = allEmployees.map(emp =>
      emp.id === employee.id
        ? {
          ...emp,
          vacations: (emp.vacations || []).map(v =>
            v.id === isEditing.id
              ? { ...v, [isEditing.field]: editValue }
              : v
          )
        }
        : emp
    );
    onSave(updatedEmployees);
    setIsEditing(null);
  };

  const handleDelete = (vacationId) => {
    const updatedEmployees = allEmployees.map(emp =>
      emp.id === employee.id
        ? {
          ...emp,
          vacations: (emp.vacations || []).filter(v => v.id !== vacationId)
        }
        : emp
    );
    onSave(updatedEmployees);
  };

  // Список месяцев в диапазоне сотрудника
  const months = [];
  {
    let cursor = rangeStart.startOf('month');
    while (cursor.isBefore(rangeEnd) || cursor.isSame(rangeEnd, 'month')) {
      months.push(cursor);
      cursor = cursor.add(1, 'month');
    }
  }

  return (
    <div className="mt-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {months.map((monthStart) => {
          const start = monthStart.startOf('month');
          const end = monthStart.endOf('month');
          const total = end.diff(start, 'day') + 1;
          const daysOfMonth = Array.from({ length: total }, (_, i) => start.add(i, 'day'));
          return (
            <div key={`emp-month-${monthStart.format('YYYY-MM')}`} className="border-t first:border-t-0 border-gray-200">
              {/* Заголовок месяца */}
              <div className="bg-blue-50 p-3 text-center">
                <div className="font-bold text-blue-600 text-lg">{getMonthName(monthStart)}</div>
              </div>
              {/* Дни недели */}
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map(weekday => (
                  <div key={`emp-w-${monthStart.format('YYYY-MM')}-${weekday}`} className="bg-gray-100 p-2 text-center text-xs font-medium text-gray-600">{weekday}</div>
                ))}
              </div>
              {/* Сетка дней */}
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {daysOfMonth.map((day) => {
                  const dayVacations = getVacationsForDay(day);
                  const isCurrentDay = day.isSame(dayjs(), 'day');
                  return (
                    <div key={`emp-d-${day.format('YYYY-MM-DD')}`} className={`min-h-[80px] bg-white p-1 relative ${isWeekend(day) ? 'bg-gray-50' : ''} ${isCurrentDay ? 'ring-2 ring-blue-400' : ''}`}>
                      <div className={`text-xs font-medium mb-1 ${isCurrentDay ? 'text-blue-600 font-bold' : isWeekend(day) ? 'text-red-500' : 'text-gray-700'}`}>{day.date()}</div>
                      {dayVacations.map((vacation) => {
                        const isStart = day.isSame(dayjs(vacation.startDate), 'day');
                        const isEnd = day.isSame(dayjs(vacation.endDate), 'day');
                        const isMiddle = !isStart && !isEnd;
                        return (
                          <div
                            key={`${vacation.id}-${day.format('YYYY-MM-DD')}`}
                            className={`mb-1 p-1 rounded text-xs text-white cursor-pointer transition-all duration-200 ${getVacationColor(vacation.type, employee.id)} ${isStart ? 'rounded-l-md' : ''} ${isEnd ? 'rounded-r-md' : ''} ${isMiddle ? 'rounded-none' : ''}`}
                            onClick={() => handleEdit(vacation.id, 'startDate')}
                            title={`${vacation.type}: ${dayjs(vacation.startDate).format('DD.MM.YYYY')} - ${dayjs(vacation.endDate).format('DD.MM.YYYY')}`}
                          >
                            <div className="flex items-center space-x-1">
                              <span className="text-xs">{getVacationIcon(vacation.type)}</span>
                              {isStart && (<span className="font-medium truncate">{vacation.type}</span>)}
                            </div>
                            {isStart && (<div className="text-xs opacity-75">Начало</div>)}
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
      {isEditing && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <input
            type={isEditing.field === 'startDate' || isEditing.field === 'endDate' ? 'date' : 'text'}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="border p-1 mr-2"
          />
          <button onClick={handleSaveEdit} className="bg-green-600 text-white px-2 py-1 rounded">
            Сохранить
          </button>
          <button onClick={() => setIsEditing(null)} className="bg-gray-400 text-white px-2 py-1 rounded ml-1">
            Отмена
          </button>
        </div>
      )}
    </div>
  );
}