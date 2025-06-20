import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComplaintCard } from './ComplaintCard';
import { ComplaintModal } from './ComplaintModal';
import { mockComplaints } from '@/data/mockData';
import { Complaint } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function ComplaintsPanel() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch = 
        complaint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [complaints, searchTerm, statusFilter, categoryFilter]);

  const handleComplaintClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleComplaintUpdate = (updatedComplaint: Complaint) => {
    setComplaints(complaints.map(c => 
      c.id === updatedComplaint.id ? updatedComplaint : c
    ));
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Complaints report is being generated...",
    });
  };

  const categories = [...new Set(complaints.map(c => c.category))];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Complaint Management</h2>
          <p className="text-muted-foreground">
            Manage and respond to public service complaints
          </p>
        </div>
        
        <Button onClick={handleDownload} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, title, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            {complaints.filter(c => c.status === 'Pending').length}
          </div>
          <div className="text-sm text-yellow-600 dark:text-yellow-400">Pending</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {complaints.filter(c => c.status === 'In Progress').length}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">In Progress</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {complaints.filter(c => c.status === 'Resolved').length}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">Resolved</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {complaints.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredComplaints.map((complaint, index) => (
          <motion.div
            key={complaint.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ComplaintCard
              complaint={complaint}
              onClick={() => handleComplaintClick(complaint)}
            />
          </motion.div>
        ))}
      </div>

      {filteredComplaints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No complaints found matching your criteria.</p>
        </div>
      )}

      {/* Complaint Modal */}
      <ComplaintModal
        complaint={selectedComplaint}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleComplaintUpdate}
      />
    </motion.div>
  );
}