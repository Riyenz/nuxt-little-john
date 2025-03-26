<template>
  <UModal
    v-model:open="isOpen"
    :title="mode === 'edit' ? 'Edit Task' : 'Add New Task'"
  >
    <slot />

    <template #body>
      <UForm
        :schema="formSchema"
        :state="formState"
        class="grid grid-cols-2 gap-4"
        @submit="onSubmit"
      >
        <UFormField label="Title" name="title" class="col-span-2">
          <UInput v-model="formState.title" class="w-full" />
        </UFormField>

        <UFormField label="Description" name="description" class="col-span-2">
          <UTextarea
            v-model="formState.description"
            class="w-full resize-none"
          />
        </UFormField>

        <UFormField label="Status" name="status">
          <USelect
            v-model="formState.status"
            :items="[
              { label: 'To Do', value: 'todo' },
              { label: 'In Progress', value: 'in-progress' },
              { label: 'Completed', value: 'completed' },
              { label: 'Cancelled', value: 'cancelled' },
            ]"
          />
        </UFormField>

        <UFormField label="Priority" name="priority">
          <USelect
            v-model="formState.priority"
            :items="[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
            ]"
          />
        </UFormField>

        <UFormField label="Assigned To" name="assignedTo">
          <UInput v-model="formState.assignedTo" />
        </UFormField>

        <UFormField label="Due Date" name="dueDate">
          <UInput v-model="formState.dueDate" type="date" />
        </UFormField>

        <div
          class="flex justify-end gap-2 col-span-2 border-t border-dashed border-gray-200 pt-4"
        >
          <UButton
            color="neutral"
            variant="soft"
            label="Cancel"
            type="button"
            @click="isOpen = false"
          />
          <UButton
            color="primary"
            :label="mode === 'edit' ? 'Update Task' : 'Create Task'"
            type="submit"
            :loading="isSubmitting"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { useTasksStore } from "~/stores/tasks";
import type { Task } from "~/types/task";
import { z } from "zod";
import { useDayTime } from "~/composables/useDayTime";

const props = defineProps<{
  task?: Task;
  mode?: "create" | "edit";
}>();

const emit = defineEmits<{
  "task-created": [];
  "task-updated": [];
}>();

const isOpen = ref(false);
const isSubmitting = ref(false);
const tasks = useTasksStore();
const { dayTime } = useDayTime();

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["todo", "in-progress", "completed", "cancelled"]),
  priority: z.enum(["low", "medium", "high"]),
  assignedTo: z.string().min(1, "Assignee is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

type FormSchema = z.output<typeof formSchema>;

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  status: "todo" as const,
  priority: "medium" as const,
  assignedTo: "",
  dueDate: "",
};

type FormState = {
  title: string;
  description: string;
  status: Task["status"];
  priority: Task["priority"];
  assignedTo: string;
  dueDate: string;
};

const formState = reactive<FormState>(
  props.task
    ? {
        ...props.task,
        dueDate: dayTime(props.task.dueDate).format("YYYY-MM-DD"),
      }
    : { ...INITIAL_FORM_STATE }
);

async function onSubmit(event: FormSubmitEvent<FormSchema>) {
  event.preventDefault();

  try {
    const validatedData = formSchema.parse(formState);
    isSubmitting.value = true;

    // Convert date string to ISO format
    const dateWithTime = new Date(validatedData.dueDate);
    dateWithTime.setHours(23, 59, 59, 999); // Set to end of day
    const dueDateISO = dateWithTime.toISOString();

    if (props.mode === "edit" && props.task) {
      // Update existing task
      const updatedTask = {
        ...props.task,
        ...validatedData,
        dueDate: dueDateISO,
        description: validatedData.description || "",
        updatedAt: new Date().toISOString(),
      };
      await tasks.updateTask(updatedTask);
      emit("task-updated");
    } else {
      // Create new task
      const newTask: Task = {
        id: `task-${tasks.tasks.length + 1}`,
        ...validatedData,
        dueDate: dueDateISO,
        description: validatedData.description || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await tasks.addTask(newTask);
      emit("task-created");
    }

    // Reset form state only for create mode
    if (props.mode !== "edit") {
      Object.keys(formState).forEach((key) => {
        const k = key as keyof FormState;
        formState[k] = INITIAL_FORM_STATE[k];
      });
    }

    isOpen.value = false;
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`${err.path.join(".")}: ${err.message}`);
      });
    } else {
      console.error("Form validation failed:", error);
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>
