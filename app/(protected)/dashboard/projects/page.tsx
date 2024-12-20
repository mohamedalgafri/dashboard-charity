import ProjectTable from '@/components/dashboard/project-table'
import { db } from '@/lib/db'
import { Project } from '@prisma/client';

const ProjectDashboard = async () => {

  const data : Project[] =  await db.project.findMany({
    orderBy:{createdAt:'desc'}
  });

    if(!data){
      throw new Error("Error");
    }

  return (
    <div>
        <div>

          <ProjectTable data={data}/>

        </div>


    </div>
  )
}

export default ProjectDashboard
