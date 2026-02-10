import ReactionRolesForm from '../components/ReactionRolesForm';
import RulesForm from '../components/RulesForm';

export default function Dashboard() {
  return (
    <div className="dashboard-layout" style={{ display: 'flex'}}>
      <div className="container ReactionRolesPanel">
        <h1>Reaction Roles</h1>
        <ReactionRolesForm />
      </div>
      <div className="container RulesPanel">
        <h1>Rules</h1>
        <RulesForm />
      </div>
    </div>
  );
}
