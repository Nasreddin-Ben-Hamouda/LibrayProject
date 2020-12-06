<?php

namespace App\Form;

use App\Entity\Book;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class BookFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id',HiddenType::class,[
                'mapped'=>false,
                'attr'=>[
                    'autocomplete'=>'off'
                ]
            ])
            ->add('reference',TextType::class,[
                'label'=>false,
                'attr'=>[
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Réfèrence'
                ],
                 'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer une réfèrence',
                    ]),
                 ],
            ])
            ->add('title',TextType::class,[
                'label'=>false,
                'attr'=>[
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Titre'
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer un titre',
                    ]),
                ],
            ])
            ->add('author',TextType::class,[
                'label'=>false,
                'attr'=>[
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Auteur'
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer un auteur',
                    ]),
                ],
            ])
            ->add('category',TextType::class,[
                'label'=>false,
                'attr'=>[
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Catégorie'
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer une catégorie',
                    ]),
                ],
            ])
            ->add('subject',TextareaType::class,[
                'label'=>false,
                'required'=>false,
                'attr'=>[
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Sujet',
                ],
            ])
            ->add('picture',FileType::class,[
                'label'=>false,
                'mapped'=>false,
                'multiple'=>true,
                'required'=>false,
                'attr'=>[
                    'class'=>'custom-file-input',
                    'placeholder'=>'Images',
                    'aria-describedby'=>'inputGroupFileAddon01'
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Book::class,
            'csrf_protection' => false,
        ]);
    }
}
