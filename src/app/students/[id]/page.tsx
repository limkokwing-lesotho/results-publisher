import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

type Props = { params: { id: string } };

type Student = {
  id: number;
  name: string;
  is_blocked: boolean;
  remarks: string;
};

type Grade = {
  id: number;
  name: string;
  code: string;
  grade: string;
  marks: number;
  points: number;
};

export default async function FacultyPage({ params }: Props) {
  const student = (
    await getDoc(doc(db, 'students', params.id))
  ).data() as Student;

  return (
    <div className='mt-10 text-gray-200 p-5 rounded-lg border border-zinc-700'>
      <div>
        <h2 className='text-xl font-semibold'>{params.id}</h2>
        <p className='text-sm text-zinc-400'>{student?.name}</p>
        <div className='text-xs mt-2 px-2 py-4 bg-zinc-800  border border-zinc-700'>
          {student?.is_blocked ? (
            <span>Blocked</span>
          ) : (
            <span>{student?.remarks || 'No Remarks'}</span>
          )}
        </div>
      </div>
      {!student?.is_blocked && <GradesTable studentId={params.id} />}
    </div>
  );
}

async function GradesTable({ studentId }: { studentId: string }) {
  const items = await getDocs(collection(db, 'students', studentId, 'grades'));
  const grades = items.docs.map((item) => item.data()) as Grade[];

  return (
    <div className='relative overflow-x-auto mt-6'>
      <table className='w-full mt-5 text-sm text-left'>
        <thead className='border-b border-gray-400 font-semibold tracking-wider '>
          <tr>
            <th scope='col' className='pb-3 text-left'>
              Course
            </th>
            <th scope='col' className='pb-3 text-left'>
              Grade
            </th>
            <th scope='col' className='pb-3 text-left'>
              Marks
            </th>
            <th scope='col' className='pb-3 text-left'>
              Points
            </th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade.id}>
              <td className='py-2 pe-4' scope='row'>
                <p>{grade.name}</p>
                <p className='text-xs text-zinc-400'>{grade.code}</p>
              </td>
              <td className='py-2 px-4'>{grade.grade}</td>
              <td className='py-2 px-4'>{grade.marks}</td>
              <td className='py-2 px-4'>{grade.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
