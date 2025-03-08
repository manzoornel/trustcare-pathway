
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Doctor } from '@/components/doctors/DoctorData';

interface AppointmentFormProps {
  doctors: Doctor[];
}

type FormData = {
  name: string;
  email: string;
  phone: string;
  doctor: string;
  date: Date;
  time: string;
  reason: string;
};

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM'
];

const AppointmentForm: React.FC<AppointmentFormProps> = ({ doctors }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  
  const selectedDoctorId = watch('doctor');
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Here you would typically send data to your backend
      console.log('Appointment data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      toast.success('Appointment booked successfully!');
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setValue('date', selectedDate as Date);
  };

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <CardTitle className="text-2xl font-bold">Appointment Confirmed!</CardTitle>
            <p className="text-gray-600">
              Your appointment has been booked successfully. A confirmation has been sent to your email.
            </p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Schedule Your Visit</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="(123) 456-7890" 
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9()-\s+]{10,15}$/,
                    message: 'Invalid phone number'
                  }
                })}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select 
                onValueChange={value => setValue('doctor', value)} 
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doctor && <p className="text-red-500 text-sm">{errors.doctor.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Appointment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={date => date < new Date() || date.getDay() === 0}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Select 
                onValueChange={value => setValue('time', value)} 
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <textarea 
              id="reason" 
              className="w-full border border-gray-300 rounded-md h-24 p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Please describe your symptoms or reason for appointment"
              {...register('reason', { required: 'Reason is required' })}
            />
            {errors.reason && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
          </div>
          
          {selectedDoctor && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Selected Doctor</h3>
              <div className="mt-2 flex items-center space-x-3">
                <img 
                  src={selectedDoctor.image} 
                  alt={selectedDoctor.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{selectedDoctor.name}</p>
                  <p className="text-sm text-gray-500">{selectedDoctor.specialty}</p>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Booking...' : 'Book Appointment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
