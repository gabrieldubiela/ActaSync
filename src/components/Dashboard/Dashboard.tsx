import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  TrendingUp,
  Plus,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Meeting } from '../../types';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [stats, setStats] = useState({
    totalMeetings: 0,
    upcomingMeetings: 0,
    completedMeetings: 0,
    totalMinutes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent meetings
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select('*')
        .order('date', { ascending: true })
        .limit(5);

      if (meetingsError) throw meetingsError;
      setMeetings(meetingsData || []);

      // Calculate stats
      const { data: allMeetings, error: statsError } = await supabase
        .from('meetings')
        .select('*');

      if (statsError) throw statsError;

      const now = new Date();
      const upcoming = allMeetings?.filter(m => new Date(m.date) >= now).length || 0;
      const completed = allMeetings?.filter(m => m.status === 'completed').length || 0;

      setStats({
        totalMeetings: allMeetings?.length || 0,
        upcomingMeetings: upcoming,
        completedMeetings: completed,
        totalMinutes: 0, // This would need to be calculated from actual minutes data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateLabel = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Hoje';
    if (isTomorrow(date)) return 'Amanhã';
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendada';
      case 'in_progress':
        return 'Em andamento';
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-primary-100 mb-6">
          Gerencie suas reuniões e atas de forma eficiente
        </p>
        <Link
          to="/meetings/new"
          className="inline-flex items-center px-4 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Reunião
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Reuniões</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMeetings}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Próximas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingMeetings}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Concluídas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedMeetings}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Atas Criadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMinutes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Próximas Reuniões</h2>
            <Link
              to="/meetings"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              Ver todas
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {meetings.length > 0 ? (
              meetings.slice(0, 3).map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                    <p className="text-sm text-gray-600">
                      {getDateLabel(meeting.date)} às {meeting.start_time}
                    </p>
                    {meeting.location && (
                      <p className="text-xs text-gray-500 mt-1">{meeting.location}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(meeting.status)}`}>
                    {getStatusLabel(meeting.status)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma reunião agendada</p>
                <Link
                  to="/meetings/new"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
                >
                  Agendar primeira reunião
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Ações Rápidas</h2>
          
          <div className="space-y-4">
            <Link
              to="/meetings/new"
              className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200 group"
            >
              <div className="p-2 bg-primary-600 rounded-lg group-hover:bg-primary-700 transition-colors duration-200">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Nova Reunião</h3>
                <p className="text-sm text-gray-600">Agendar uma nova reunião</p>
              </div>
            </Link>

            <Link
              to="/templates"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 group"
            >
              <div className="p-2 bg-green-600 rounded-lg group-hover:bg-green-700 transition-colors duration-200">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Templates</h3>
                <p className="text-sm text-gray-600">Gerenciar templates de atas</p>
              </div>
            </Link>

            <Link
              to="/minutes"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 group"
            >
              <div className="p-2 bg-purple-600 rounded-lg group-hover:bg-purple-700 transition-colors duration-200">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Relatórios</h3>
                <p className="text-sm text-gray-600">Ver atas e relatórios</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;