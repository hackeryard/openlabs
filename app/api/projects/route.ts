import { connectDB } from "@/app/lib/mongodb";
import Project from "@/app/models/Project";
import { getUserFromToken } from "@/app/lib/getUserFromToken";

export async function POST(req: Request) {
    try {
        await connectDB();

        const user = getUserFromToken();

        if (!user) {
            return Response.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const { projectId, title, html, css, js, projectType } = await req.json();

        const project = await Project.findOneAndUpdate(
            {
                projectId,
                userId: user.id
            },
            { title, html, css, js, projectType },
            { upsert: true, new: true }
        );

        return Response.json({ success: true, project });

    } catch (err) {
        console.error("POST error:", err);
        return Response.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();

        const user = getUserFromToken();
        if (!user) {
            return Response.json({ error: "Not authenticated" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get("projectId");
        const projectType = searchParams.get("projectType");

        // ✅ Load single project
        if (projectId) {
            const project = await Project.findOne({
                projectId,
                projectType: projectType,
                userId: user.id,
            });

            if (!project) {
                return Response.json({
                    title: "Untitled Project",
                    html: "",
                    css: "",
                    js: ""
                });
            }

            return Response.json(project);
        }

    // ✅ Load all projects for sidebar
    let projects = await Project.find(
        {
            userId: user.id,
            projectType: projectType
        }
    ).sort({ updatedAt: -1 });

    if (projects.length === 0) {
        const defaultProject = await Project.create({
            projectId: crypto.randomUUID(),
            projectType: projectType,
            userId: user.id,
            title: "Untitled Project",
            html: "",
            css: "",
            js: "",
        });

        projects = [defaultProject];
    }

    return Response.json(projects);

} catch (err) {
    console.error("GET error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
}
}

export async function DELETE(req: Request) {
    try {
        await connectDB();

        const user = getUserFromToken();

        if (!user) {
            return Response.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get("projectId");

        if (!projectId) {
            return Response.json(
                { error: "Project ID required" },
                { status: 400 }
            );
        }

        await Project.deleteOne({
            projectId,
            userId: user.id
        });

        return Response.json({ success: true });

    } catch (err) {
        console.error("DELETE error:", err);
        return Response.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
