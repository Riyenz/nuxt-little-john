<template>
  <UModal v-model:open="isOpen" title="Add New Task">
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
            color="gray"
            variant="soft"
            label="Cancel"
            type="button"
            @click="isOpen = false"
          />
          <UButton
            color="primary"
            label="Create Task"
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

const emit = defineEmits<{
  "task-created": [];
}>();

const isOpen = ref(false);
const isSubmitting = ref(false);
const tasks = useTasksStore();

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "completed", "cancelled"]),
  priority: z.enum(["low", "medium", "high"]),
  assignedTo: z.string().min(1, "Assignee is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

type FormSchema = z.output<typeof formSchema>;

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assignedTo: "",
  dueDate: "",
} as const;

const formState = reactive({ ...INITIAL_FORM_STATE });

async function onSubmit(event: FormSubmitEvent<FormSchema>) {
  event.preventDefault();

  try {
    const validatedData = formSchema.parse(formState);
    isSubmitting.value = true;

    const newTask: Task = {
      id: `task-${tasks.tasks.length + 1}`,
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.addTask(newTask);

    Object.keys(formState).forEach((key) => {
      formState[key as keyof typeof formState] =
        INITIAL_FORM_STATE[key as keyof typeof INITIAL_FORM_STATE];
    });

    isOpen.value = false;
    emit("task-created");
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
