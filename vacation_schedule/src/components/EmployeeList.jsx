import VacationTimeline from './VacationTimeline';

export default function EmployeeList({ employees = [], onSave }) {
    const getVacationStats = (employee) => {
        const vacations = employee.vacations || [];
        const totalDays = vacations.reduce((sum, v) => {
            const start = new Date(v.startDate);
            const end = new Date(v.endDate);
            const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            return sum + diff;
        }, 0);

        return {
            totalDays,
            vacationCount: vacations.filter(v => v.type === 'отпуск').length,
            sickCount: vacations.filter(v => v.type === 'больничный').length,
            dayOffCount: vacations.filter(v => v.type === 'отгул').length
        };
    };

    return (
        <div className='space-y-6'>

            {employees.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-medium text-gray-600 mb-2">Сотрудники не найдены</h3>
                    <p className="text-gray-500">Добавьте первого сотрудника с отпуском</p>
                </div>
            ) : (
                employees.map((employee) => {
                    const stats = getVacationStats(employee);
                    return (
                        <div key={employee.id} className='bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200'>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
                                            {employee.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className='font-bold text-xl text-gray-800'>{employee.name}</h3>
                                            <p className='text-gray-600'>{employee.position}</p>
                                        </div>
                                    </div>

                                    {/* Статистика сотрудника */}
                                    <div className="grid grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">{stats.totalDays}</div>
                                            <div className="text-xs text-gray-500">Всего дней</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">{stats.vacationCount}</div>
                                            <div className="text-xs text-gray-500">Отпусков</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-red-600">{stats.sickCount}</div>
                                            <div className="text-xs text-gray-500">Больничных</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-600">{stats.dayOffCount}</div>
                                            <div className="text-xs text-gray-500">Отгулов</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <VacationTimeline
                                employee={employee}
                                onSave={onSave}
                                allEmployees={employees}
                            />
                        </div>
                    );
                })
            )}
        </div>
    );
}
// npm init vite@latest
// yarn create vite
// pnpm dlx create-vite