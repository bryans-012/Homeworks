import { useState, useEffect } from 'react';
import { LinkedList } from './LinkedList';
import { DoublyLinkedList } from './DoublyLinkedList';
import { CircularLinkedList } from './CircularLinkedList';
import { CircularDoublyLinkedList } from './CircularDoublyLinkedList';

function ClinicSystem() {
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [currentCommitteeIndex, setCurrentCommitteeIndex] = useState(0);
  const [committee, setCommittee] = useState([]);
  const activeDoctor = doctors[currentDoctorIndex] || 'Sin medico';
  const totalPatients = waitingQueue.length;
  const activePatient = waitingQueue[currentPatientIndex] || null;
  const totalHistory = history.length;
  const activeRecord = history[currentHistoryIndex] || null;
  const totalCommittee = committee.length;
  const activeCommitteeMember = committee[currentCommitteeIndex] || null;

  useEffect(() => {
    const queue = new LinkedList();
    queue.push({ id: 1, name: 'Andres Diaz', phone: '3134487845' });
    queue.push({ id: 2, name: 'Maria Manrique', phone: '3235478695' });
    queue.push({ id: 3, name: 'Brya Lopez', phone: '3456897415' });
    setWaitingQueue(queue.toArray());

    const doctorsList = new CircularLinkedList();
    doctorsList.push('Dr. Jorge Nitales');
    doctorsList.push('Dra. Rosa Melano');
    doctorsList.push('Dr. Andres Iniesta');
    setDoctors(doctorsList.toArray());

    const committeList = new CircularDoublyLinkedList();
    committeList.push('Admin Lopez');
    committeList.push('Admin Garcia');
    committeList.push('Admin Martinez');
    setCommittee(committeList.toArray());

    const historicalData = new DoublyLinkedList();
    historicalData.push({ name: 'Pedro Sanchez'});
    historicalData.push({ name: 'Ana Silva'});
    setHistory(historicalData.toArray());
  }, []);

  useEffect(() => {
    if (doctors.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentDoctorIndex((prev) => (prev + 1) % doctors.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [doctors.length]);

  useEffect(() => {
    if (totalPatients === 0) {
      setCurrentPatientIndex(0);
      return;
    }

    if (currentPatientIndex >= totalPatients) {
      setCurrentPatientIndex(0);
    }
  }, [totalPatients, currentPatientIndex]);

  useEffect(() => {
    if (totalHistory === 0) {
      setCurrentHistoryIndex(0);
      return;
    }

    if (currentHistoryIndex >= totalHistory) {
      setCurrentHistoryIndex(0);
    }
  }, [totalHistory, currentHistoryIndex]);

  useEffect(() => {
    if (totalCommittee === 0) {
      setCurrentCommitteeIndex(0);
      return;
    }

    if (currentCommitteeIndex >= totalCommittee) {
      setCurrentCommitteeIndex(0);
    }
  }, [totalCommittee, currentCommitteeIndex]);

  const handleNextPatient = () => {
    if (totalPatients === 0) return;
    setCurrentPatientIndex((prev) => (prev + 1) % totalPatients);
  };

  const handleNextHistory = () => {
    if (totalHistory === 0 || currentHistoryIndex >= totalHistory - 1) return;
    setCurrentHistoryIndex((prev) => prev + 1);
  };

  const handlePreviousHistory = () => {
    if (totalHistory === 0 || currentHistoryIndex <= 0) return;
    setCurrentHistoryIndex((prev) => prev - 1);
  };

  const handleNextCommittee = () => {
    if (totalCommittee === 0) return;
    setCurrentCommitteeIndex((prev) => (prev + 1) % totalCommittee);
  };

  const handlePreviousCommittee = () => {
    if (totalCommittee === 0) return;
    setCurrentCommitteeIndex((prev) => (prev - 1 + totalCommittee) % totalCommittee);
  };

  const handleAttendPatient = () => {
    if (waitingQueue.length > 0) {
      const attendedPatient = waitingQueue[currentPatientIndex];
      const historialsData = new DoublyLinkedList();
      history.forEach(h => historialsData.push(h));
      historialsData.push({
        name: attendedPatient.name,
        date: new Date().toISOString().split('T')[0],
        doctor: doctors[currentDoctorIndex]
      });
      setHistory(historialsData.toArray());

      const updatedQueue = waitingQueue.filter((item) => item.id !== attendedPatient.id);
      setWaitingQueue(updatedQueue);

      if (updatedQueue.length === 0 || currentPatientIndex >= updatedQueue.length) {
        setCurrentPatientIndex(0);
      }
    }
  };

  return (
    <div>
      <div className="list-container">
        <h2>Pacientes en espera</h2>
        {activePatient ? (
          <div className="list-items">
            <li className="list-item current-item">
              <span className="item-index">{currentPatientIndex + 1}</span>
              <div className="item-info">
                <div className="item-title">{activePatient.name}</div>
                <div className="item-subtitle">Tel: {activePatient.phone}</div>
              </div>
            </li>
            <div className="patient-count">
              Paciente {currentPatientIndex + 1} de {totalPatients}
            </div>
          </div>
        ) : (
          <div className="empty-message">No hay pacientes en espera</div>
        )}
        <div className="controls" style={{ marginTop: '20px' }}>
          <button className="btn" onClick={handleNextPatient} disabled={totalPatients === 0}>
            Siguiente paciente
          </button>
          <button className="btn" onClick={handleAttendPatient} disabled={totalPatients === 0}>
            Mandar a consulta
          </button>
        </div>
      </div>

      <div className="list-container">
        <h2>Historial del dia</h2>
        {activeRecord ? (
          <div className="list-items">
            <li className="list-item current-item">
              <div className="item-info">
                <div className="item-title">{activeRecord.name}</div>
              </div>
            </li>
            <div className="patient-count">
              Registro {currentHistoryIndex + 1} de {totalHistory}
            </div>
          </div>
        ) : (
          <div className="empty-message">Sin historial de atencion</div>
        )}
        <div className="controls" style={{ marginTop: '20px' }}>
          <button className="btn" onClick={handlePreviousHistory} disabled={totalHistory === 0 || currentHistoryIndex === 0}>
            Anterior
          </button>
          <button className="btn" onClick={handleNextHistory} disabled={totalHistory === 0 || currentHistoryIndex === totalHistory - 1}>
            Siguiente
          </button>
        </div>
      </div>

      <div className="list-container">
        <h2>Equipo medico</h2>
        <ul className="list-items">
          {doctors.map((doctor, idx) => (
            <li key={idx} className={`list-item ${idx === currentDoctorIndex ? 'current-item' : ''}`}>
              <div className="item-info">
                <div className="item-title">{doctor}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="item-subtitle">Medico de turno: {activeDoctor}</div>
      </div>

      <div className="list-container">
        <h2>Comite admin</h2>
        {activeCommitteeMember ? (
          <div className="list-items">
            <li className="list-item current-item">
              <div className="item-info">
                <div className="item-title">{activeCommitteeMember}</div>
              </div>
            </li>
            <div className="patient-count">
              Miembro {currentCommitteeIndex + 1} de {totalCommittee}
            </div>
          </div>
        ) : (
          <div className="empty-message">Sin miembros del comite</div>
        )}
        <div className="controls" style={{ marginTop: '20px' }}>
          <button className="btn" onClick={handlePreviousCommittee}>
            Anterior
          </button>
          <button className="btn" onClick={handleNextCommittee}>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClinicSystem;
