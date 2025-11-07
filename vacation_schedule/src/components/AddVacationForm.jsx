import { useState } from 'react';
import dayjs from 'dayjs';

export default function AddVacationForm({ employees = [], onSave }) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('отпуск');
  const [position, setPosition] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Имя сотрудника обязательно';
    }

    if (!startDate) {
      newErrors.startDate = 'Дата начала обязательна';
    }

    if (!endDate) {
      newErrors.endDate = 'Дата окончания обязательна';
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'Дата окончания должна быть после даты начала';
    }

    if (!position.trim()) {
      newErrors.position = 'Должность обязательна';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const emp = employees.find(e => e.name === name);
    const newVacation = {
      id: Date.now(),
      startDate,
      endDate,
      type
    };

    let updatedEmployees;
    if (emp) {
      // Проверяем пересечения с существующими отпусками
      const hasConflict = (emp.vacations || []).some(vacation => {
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);
        const existingStart = new Date(vacation.startDate);
        const existingEnd = new Date(vacation.endDate);

        return (newStart <= existingEnd && newEnd >= existingStart);
      });

      if (hasConflict) {
        setErrors({ general: 'У сотрудника уже есть отпуск в указанные даты' });
        return;
      }

      updatedEmployees = employees.map(e =>
        e.name === name
          ? { ...e, vacations: [...(e.vacations || []), newVacation] }
          : e
      );
    } else {
      updatedEmployees = [
        ...employees,
        {
          id: Date.now() + 1,
          name,
          position,
          vacations: [newVacation]
        }
      ];
    }

    onSave(updatedEmployees);
    setName('');
    setStartDate('');
    setEndDate('');
    setPosition('');
    setErrors({});
  };

  const getTypeIcon = (type) => {
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

  const getVacationColor = (type) => {
    switch (type) {
      case 'отпуск':
        return 'bg-green-500';
      case 'больничный':
        return 'bg-red-500';
      case 'отгул':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getDuration = () => {
    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      const days = end.diff(start, 'day') + 1;
      return days;
    }
    return 0;
  };

  const getWeekendDays = () => {
    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      let weekendDays = 0;

      for (let day = start; day.isBefore(end) || day.isSame(end, 'day'); day = day.add(1, 'day')) {
        if (day.day() === 0 || day.day() === 6) {
          weekendDays++;
        }
      }
      return weekendDays;
    }
    return 0;
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <span className="mr-2">📋</span>
        Добавить отпуск сотрудника
      </h2>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Имя сотрудника *
          </label>
          <input
            type="text"
            placeholder="Введите имя сотрудника"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            list="employees-list"
          />
          <datalist id="employees-list">
            {employees.map(emp => (
              <option key={emp.id} value={emp.name} />
            ))}
          </datalist>
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Должность *
          </label>
          <input
            type="text"
            placeholder="Должность"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.position ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.position && (
            <p className="text-red-500 text-sm mt-1">{errors.position}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата начала *
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата окончания *
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.endDate ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Тип отпуска
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="отпуск">🏖️ Отпуск</option>
            <option value="больничный">🏥 Больничный</option>
            <option value="отгул">📅 Отгул</option>
          </select>
        </div>
      </div>

      {/* Предварительный просмотр отпуска */}
      {startDate && endDate && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            👁️ Предварительный просмотр
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{getDuration()}</div>
              <div className="text-sm text-gray-600">Всего дней</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{getDuration() - getWeekendDays()}</div>
              <div className="text-sm text-gray-600">Рабочих дней</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">{getWeekendDays()}</div>
              <div className="text-sm text-gray-600">Выходных</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className={`text-2xl font-bold text-white p-2 rounded ${getVacationColor(type)}`}>
                {getTypeIcon(type)}
              </div>
              <div className="text-sm text-gray-600 mt-1">{type}</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Период:</div>
            <div className="text-lg font-semibold text-gray-800">
              {dayjs(startDate).format('DD.MM.YYYY (dddd)')} - {dayjs(endDate).format('DD.MM.YYYY (dddd)')}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Выбранный тип:</span>
          <span className="font-medium flex items-center">
            {getTypeIcon(type)} {type}
          </span>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <span>✅</span>
          <span>Добавить отпуск</span>
        </button>
      </div>
    </form>
  );
}