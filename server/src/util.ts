import mongoose from 'mongoose';
export type ObjectId = mongoose.Types.ObjectId;

export const getAddedRemoved = (newValues: string[], oldValues: string[]) => {
    const newValuesSet = new Set(newValues);
    const oldValuesSet = new Set(oldValues);
    const added: string[] = [];
    const removed: string[] = [];
    if (newValues) {
        newValues.forEach((value) => {
            if (!oldValuesSet.has(value)) {
                added.push(value);
            }
        });
    }

    if (oldValues) {
        oldValues.forEach((value) => {
            if (!newValuesSet.has(value)) {
                removed.push(value);
            }
        });
    }

    return { added, removed };
};

export const toObjectIdArray = (values: string[]): ObjectId[] =>
    values.map((v) => new mongoose.Types.ObjectId(v));

export const toStringArray = (values: ObjectId[]): string[] =>
    values.map((v) => v.toHexString());
