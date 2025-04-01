import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from "../../utils/apiPaths";
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';

function Income() {

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setDeleteAlert] = useState({
    show: false,
    date: null,
  });
  const [openAddIncomeModel, setOpenAddIncomeModel] = useState(false);

  const fetchIncomeDetails = async () => {
    if(!loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      if(response.data) {
        setIncomeData(response.data);
      }
    } catch(error) {
      console.log("Something went wrong. Please try again", error); 
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (income) => {
    const {source, amount, date, icon} = income;

    if(!source.trim()) {
      toast.error("Source is required.");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if(!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });

      setOpenAddIncomeModel(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch(error) {
      console.error(
        "Error adding income:",
        error.response?.data?.message || error.message
      );
    }
  };

  const deleteIncome = async () => {};

  const handleDownloadIncomeDetails = async () => {};

  useEffect(() => {
    fetchIncomeDetails()

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModel(true)}
            />
          </div>
        </div>

        <Modal
        isOpen={openAddIncomeModel}
        onClose={() => setOpenAddIncomeModel(false)}
        title="Add Income"
        >
         <AddIncomeForm onAddIncome={handleAddIncome}/>
        </Modal>
      </div>
    </DashboardLayout>
    
  )
}

export default Income