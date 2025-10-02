import { ReservationForm } from '../ReservationForm';

export default function ReservationFormExample() {
  const handleSubmit = (data: any) => {
    console.log('Reservation submitted:', data);
  };

  return <ReservationForm onSubmit={handleSubmit} />;
}
