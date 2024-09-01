import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Pitch {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

interface Investment {
  amount: number;
  date: string;
}

interface Feedback {
  id: number;
  content: string;
  createdAt: string;
}

interface Interest {
  id: number;
  createdAt: string;
}

interface Analytics {
  pitchesCount: number;
  investmentsCount: number;
  feedbacksCount: number;
  interestsCount: number;
  pitches: Array<Pitch>;
  investments: Array<Investment>;
  feedbacks: Array<Feedback>;
  interests: Array<Interest>;
}

export default function ProposalsAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const router = useRouter();
  const [chartWidth, setChartWidth] = useState<number>(300);
  const [chartHeight, setChartHeight] = useState<number>(300);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.analytics);
      } catch (error) {
        toast.error("Failed to load analytics data");
      }
    }

    fetchAnalytics();
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setChartWidth(window.innerWidth - 30); // Smaller width for smaller screens
        setChartHeight(200); // Smaller height for smaller screens
      } else {
        setChartWidth(768);
        setChartHeight(400); // Default height for larger screens
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedPitch) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [selectedPitch]);

  const handlePitchClick = (pitch: Pitch) => {
    setSelectedPitch(pitch);
  };

  const handleEdit = () => {
    toast.info("Edit functionality not yet implemented.");
  };

  const handleDelete = () => {
    toast.info("Delete functionality not yet implemented.");
  };

  const handleCloseOverlay = () => {
    setSelectedPitch(null);
  };

  const handleViewAllPitches = () => {
    router.push("/pitches");
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const prepareChartData = (items: any[], dateKey: string, countKey: string) => {
    const groupedData = items.reduce((acc: { [key: string]: number }, item) => {
      const date = formatDate(item[dateKey]);
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += item[countKey] || 1; // Default to 1 for counts
      return acc;
    }, {});

    return Object.entries(groupedData).map(([date, count]) => ({
      date,
      count
    }));
  };

  const pitchesData = prepareChartData(data?.pitches || [], 'createdAt', 'count');
  const investmentsData = prepareChartData(data?.investments || [], 'date', 'amount');
  const feedbacksData = prepareChartData(data?.feedbacks || [], 'createdAt', 'count');
  const interestsData = prepareChartData(data?.interests || [], 'createdAt', 'count');

  const tooltipStyle = {
    backgroundColor: '#333',
    border: '1px solid #666',
    color: '#fff',
    fontSize: '14px',
    padding: '10px',
    borderRadius: '4px',
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-full md:max-w-7xl mx-auto py-6 md:py-10">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-yellow-400">
          Pitches Analytics
        </h2>

        {data ? (
          <div className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="p-4 md:p-6 rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800">
                <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">Total Pitches</p>
                <p className="text-3xl md:text-4xl font-bold text-gold-500">{data.pitchesCount}</p>
              </div>
              <div className="p-4 md:p-6 rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800">
                <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">Total Investments</p>
                <p className="text-3xl md:text-4xl font-bold text-gold-500">{data.investmentsCount}</p>
              </div>
              <div className="p-4 md:p-6 rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800">
                <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">Total Feedbacks</p>
                <p className="text-3xl md:text-4xl font-bold text-gold-500">{data.feedbacksCount}</p>
              </div>
              <div className="p-4 md:p-6 rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800">
                <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">Total Interests</p>
                <p className="text-3xl md:text-4xl font-bold text-gold-500">{data.interestsCount}</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6">Detailed Analytics</h3>
              <div className="space-y-6">
                {/* Pitches Trend */}
                <div className="p-4 md:p-6 rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800">
                  <h4 className="text-xl md:text-2xl font-semibold mb-4">Pitches Over Time</h4>
                  <LineChart width={chartWidth} height={chartHeight} data={pitchesData} className="w-full">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                    <Legend />
                  </LineChart>
                </div>

                {/* Investments Chart */}
                <div className="p-4 md:p-6 rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800">
                  <h4 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Investments Over Time</h4>
                  <BarChart width={chartWidth} height={chartHeight} data={investmentsData} className="w-full">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="amount" fill="#82ca9d" />
                  </BarChart>
                </div>

                {/* Feedbacks Trend */}
                <div className="p-4 md:p-6 rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800">
                  <h4 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Feedbacks Over Time</h4>
                  <LineChart width={chartWidth} height={chartHeight} data={feedbacksData} className="w-full">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="count" stroke="#ff7300" />
                    <Legend />
                  </LineChart>
                </div>

                {/* Interests Trend */}
                <div className="p-4 md:p-6 rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800">
                  <h4 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Interests Over Time</h4>
                  <LineChart width={chartWidth} height={chartHeight} data={interestsData} className="w-full">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="count" stroke="#387908" />
                    <Legend />
                  </LineChart>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <button onClick={handleViewAllPitches} className="bg-gold-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gold-600">
                View All Pitches
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-48">
            <Loader />
          </div>
        )}

        {selectedPitch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
              <h3 className="text-2xl font-semibold mb-4">{selectedPitch.title}</h3>
              <p className="mb-4">{selectedPitch.description}</p>
              <p className="text-gray-500">{formatDate(selectedPitch.createdAt)}</p>
              <div className="mt-4 flex justify-end gap-4">
                <button onClick={handleEdit} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                  Edit
                </button>
                <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
                  Delete
                </button>
                <button onClick={handleCloseOverlay} className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
