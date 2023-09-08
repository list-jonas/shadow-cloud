import { Chip } from "primereact/chip";

interface DateTimeChipsProps {
  date: Date;
}

const DateTimeChips: React.FC<DateTimeChipsProps> = (props) => {
  const { date } = props;

  const fullDateStr = new Date(date).toLocaleString();
  const dateStr = fullDateStr.split(',')[0];
  const timeStr = fullDateStr.split(',')[1].split(':')[0] + ':' + fullDateStr.split(',')[1].split(':')[1];

  return (
    <>
      <Chip label={dateStr} className="mr-1" />
      <Chip label={timeStr} />
    </>
  );
};

export default DateTimeChips;