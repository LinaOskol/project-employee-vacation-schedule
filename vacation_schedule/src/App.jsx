import React from 'react';
import { useState, useEffect } from 'react';
import { loadEmployees, saveEmployees, clearEmployees } from './utils/storage';
import Header from './components/Header';
import EmployeeList from './components/EmployeeList';
import AddVacationForm from './components/AddVacationForm';
import CompanyCalendar from './components/CompanyCalendar';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Что-то пошло не так</h2>
            <p className="text-gray-600 mb-4">Произошла ошибка в приложении</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('employees'); // 'employees' или 'calendar'

  useEffect(() => {
    const loadedEmployees = loadEmployees();
    console.log('Загруженные сотрудники:', loadedEmployees);
    setEmployees(loadedEmployees);
    setIsLoading(false);
  }, []);

  const handleSave = (updatedEmployees) => {
    setEmployees(updatedEmployees);
    saveEmployees(updatedEmployees);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-600">Загрузка данных...</h2>
          <p className="text-gray-500">Подождите, загружаем информацию о сотрудниках</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header onClear={() => {
          clearEmployees();
          setEmployees([]);
        }} />
        <div className="container mx-auto p-4 lg:p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              📅 Система управления отпусками сотрудников
            </h1>
            <p className="text-gray-600 text-center">
              Управляйте графиком отпусков, больничных и отгулов вашей команды
            </p>
          </div>

          {/* Переключатель вкладок */}
          <div className="mb-6 flex justify-center">
            <div className="bg-white p-1 rounded-lg shadow-lg border border-gray-200">
              <button
                onClick={() => setActiveTab('employees')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'employees'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                👥 Сотрудники
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'calendar'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                🏢 Общий календарь
              </button>
            </div>
          </div>

          {/* Содержимое вкладок */}
          {activeTab === 'employees' ? (
            <>
              <AddVacationForm employees={employees} onSave={handleSave} />
              <EmployeeList employees={employees} onSave={handleSave} />
            </>
          ) : (
            <CompanyCalendar employees={employees} />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;